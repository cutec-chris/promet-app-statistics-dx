library statistics;
  uses js, web, classes, Avamm, webrouter, AvammForms;

resourcestring
  strReports             = 'Berichte';

var
  Statistics : TAvammListForm = nil;

Procedure ShowStatistic(URl : String; aRoute : TRoute; Params: TStrings);
var
  aForm: TAvammForm;
begin
  aForm := TAvammForm.Create(fmWindow,'statistics',Params.Values['Id']);
end;

Procedure ShowStatistics(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  if Statistics = nil then
    begin
      aParent := TJSHTMLElement(GetAvammContainer());
      Statistics := TAvammListForm.Create(aParent,'statistics');
      Statistics.Grid.setHeader('Name,Status',',',TJSArray._of([]));
      Statistics.Grid.setColumnIds('NAME,STATUS');
      Statistics.Grid.setColTypes('ro,ro');
      Statistics.Grid.attachHeader('#text_filter,#text_filter');
      Statistics.Grid.setInitWidths('*,100');
      Statistics.Grid.init();
    end;
  Statistics.Show;
end;

initialization
  writeln('Hello World from Statistics...');
  RegisterSidebarRoute(strReports,'statistics',@ShowStatistics);
  Router.RegisterRoute('/statistics/by-id/:Id/',@ShowStatistic);
end.

