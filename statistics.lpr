library statistics;
  uses js, web, classes, Avamm, webrouter, AvammForms;

resourcestring
  strReports             = 'Berichte';

var
  Statistics : TAvammListForm = nil;

Procedure ShowStatistics(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: TJSHTMLElement;
begin
  writeln('Statistics should be shown');
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
end.

