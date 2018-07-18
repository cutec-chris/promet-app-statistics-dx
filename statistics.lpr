library statistics;
  uses js, web, classes, Avamm, webrouter, AvammForms, dhtmlx_base,
    dhtmlx_form,SysUtils, Types;

type

  { TStatisticsForm }

  TStatisticsForm = class(TAvammForm)
  private
    ContentLoadedEvent: Integer;
  protected
    ContentForm : TDHTMLXForm;
    procedure DoLoadData; override;
    procedure CreateForm;
    procedure DoOpen;
    procedure DoExecute;
  end;

resourcestring
  strReports             = 'Berichte';
  strContent             = 'Inhalt';
  strExecute             = 'Ausführen';
  strNoReport            = 'kein Bericht verfügbar !';
  strSettings            = 'Einstellungen';

var
  Statistics : TAvammListForm = nil;
Procedure ShowStatistic(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
begin
  aForm := TStatisticsForm.Create(fmInlineWindow,'statistics',Params.Values['Id'],Params.Values['Params']);
end;
Procedure ShowStatistics(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if Statistics = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Statistics := TAvammListForm.Create(aParent,'statistics');
      Statistics.Grid.setHeader('Name,Status');
      Statistics.Grid.setColumnIds('NAME,STATUS');
      Statistics.Grid.setColTypes('ro,ro');
      Statistics.Grid.attachHeader('#text_filter,#text_filter');
      Statistics.Grid.setInitWidths('*,100');
      Statistics.Grid.init();
    end;
  Statistics.Show;
end;
{ TStatisticsForm }
procedure TStatisticsForm.DoLoadData;
begin
  CreateForm;
  inherited;
  DoOpen;
end;
procedure TStatisticsForm.CreateForm;
  procedure ToolbarButtonClick(id : string);
  begin
    if (id='execute') then
      begin
        DoExecute;
      end
    ;
  end;
begin
  Tabs.addTab('content',strContent,100,0,true,false);
  Tabs.cells('content').hide;
  Toolbar.addButton('execute',0,strExecute,'fa fa-pie-chart','fa fa-pie-chart');
  Form.addItem(null,js.new(['type','label','label',strSettings,'hidden',true,'name','lSettings']));
  Toolbar.attachEvent('onClick', @ToolbarButtonClick);
  ContentForm := Form;
end;
procedure TStatisticsForm.DoOpen;
  procedure CheckRemoveItem(aName : string);
  begin
    if ContentForm.getUserData(aName,'statistics','n')='y' then
      ContentForm.removeItem(aName);
  end;
var
  aQuerry: string;
  aRegex: TJSRegexp;
  aCont: TStringDynArray;
  HasControls,
  DontExecute: Boolean;
  aHeight, i: Integer;
begin
  DontExecute:=False;
  aQuerry := string(Data.Properties['QUERRY']);
  aRegex := TJSRegexp.New('@(.*?):(.*?)@');
  aCont := aRegex.exec(aQuerry);
  HasControls := False;
  ContentForm.forEachItem(@CheckRemoveItem);
  aHeight := 70;
  i := 0;
  while i < length(aCont) do
    begin
      inc(i);
      ContentForm.addItem(null,js.new(['type','input','name',aCont[i],'label',aCont[i],'value','*']));
      if Params.Values[aCont[i]]<>'' then
        ContentForm.setItemValue(aCont[i],Params.Values[aCont[i]])
      else
        DontExecute := True;
      ContentForm.setUserData(aCont[i],'statistics','y');
      HasControls:=True;
      inc(i,2);
      aHeight:=aHeight+70;
    end;
  if HasControls then
    ContentForm.showItem('lSettings')
  else
    ContentForm.hideItem('lSettings');
  Layout.cells('a').setHeight(aHeight);
  if not DontExecute then
    DoExecute;
end;
procedure TStatisticsForm.DoExecute;
  function DoShowPDF(aValue: TJSXMLHttpRequest): JSValue;
    procedure PDFIsLoaded;
    var
      aFrame: TJSWindow;
      aRequest: TJSXMLHttpRequest;
    begin
      if aValue.Status<>200 then
        begin
          Layout.progressOff;
          dhtmlx.message(js.new(['type','error',
                                 'text',aValue.responseText]));
          Tabs.cells('content').hide;
        end
      else
        begin
          aFrame := Tabs.cells('content').getFrame;
          Avamm.InitWindow(aFrame);
          aRequest := aValue;
          Tabs.cells('content').show;
          Tabs.cells('content').setActive;
          Layout.progressOff;
          asm
            aFrame = aFrame.contentWindow;
            var reader = new FileReader();
            reader.addEventListener('loadend', function() {
              var aPdf = aFrame.loadPdf({data:this.result});
              aBlob = null;
              reader = null;
            });
            aBlob = null;
            reader.addEventListener("onerror", function (error) {
                  throw error;
                }, false);
            var aBlob = new Blob([aRequest.response], {type: "application/octet-stream"})
            reader.readAsArrayBuffer(aBlob);
          end;
          Tabs.detachEvent(ContentLoadedEvent);
        end;
    end;
  begin
    with Tabs.cells('content') do
      begin
        attachURL('/appbase/pdfview.html');
        Avamm.InitWindow(getFrame);
      end;
    ContentLoadedEvent := Tabs.attachEvent('onContentLoaded',@PDFIsLoaded);
  end;
  function DoLoadPDF(aValue: TJSXMLHttpRequest): JSValue;
  var
    aReports: TJSArray;
    aName,aExt, aUrl: String;
    i: Integer;
    ReportLoaded: Boolean = False;

    procedure AddParamToUrl(aParam : string);
    begin
      if (ContentForm.getUserData(aParam,'statistics', 'n') = 'y') then
        aUrl := aUrl+'&'+aParam+'='+string(ContentForm.getItemValue(aParam));
    end;
  begin
    //Build Params
    for i := 0 to Reports.length-1 do
      begin
        aName := string(TJSObject(Reports[i]).Properties['name']);
        aExt := copy(aName,pos('.',aName)+1,length(aName));
        aName := copy(aName,0,pos('.',aName)-1);
        if aExt = 'pdf' then
          begin
            aUrl := '/'+TableName+'/by-id/'+string(Id)+'/reports/'+string(TJSObject(Reports[i]).Properties['name']);
            aUrl := aUrl+'?exec=1';
            ContentForm.forEachItem(@AddParamToUrl);
            //Load PDF
            LoadData(aUrl,False,'',15000)._then(TJSPromiseResolver(@DoShowPDF));
            ReportLoaded := True;
          end;
      end;
    if not ReportLoaded then
      begin
        Layout.progressOff;
        Tabs.cells('content').hide;
        dhtmlx.message(js.new(['type','warning',
                               'text',strNoReport]));
      end;
  end;
var
  aDiv: TJSWindow;
begin
  Layout.progressOn;
  ReportsLoaded._then(TJSPromiseresolver(@DoLoadPDF));
end;

initialization
  if getRight('STATISTICS')>0 then
    RegisterSidebarRoute(strReports,'statistics',@ShowStatistics);
  Router.RegisterRoute('/statistics/by-id/:Id/:Params',@ShowStatistic);
end.

