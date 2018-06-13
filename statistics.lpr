library statistics;
  uses js, web, classes, Avamm, webrouter, AvammForms;

resourcestring
  strReports             = 'Berichte';

var
  List : TAvammListForm;

Procedure ShowStatistics(URl : String; aRoute : TRoute; Params: TStrings);
var
  aParent: JSValue;
begin
  writeln('Statistics should be shown');
  if not Assigned(List) then
    begin
      aParent := GetAvammContainer();
      List := TAvammListForm.Create(aParent,'statistics');
    end;
end;

initialization
  writeln('Hello World from Statistics...');
  RegisterSidebarRoute(strReports,'statistics',@ShowStatistics);
end.

