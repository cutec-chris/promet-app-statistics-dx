library statistics;
  uses js, web, classes, Avamm, webrouter;

resourcestring
  strReports             = 'Berichte';

Procedure ShowStatistics(URl : String; aRoute : TRoute; Params: TStrings);
begin
  writeln('Statistics should be shown');
end;

initialization
  writeln('Hello World from Statistics...');
  RegisterSidebarRoute(strReports,'statistics',@ShowStatistics);
end.

