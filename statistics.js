var Statistics;
dhtmlxEvent(window,"load",function(){
  Statistics = newPrometList('statistics','Berichte');
  Statistics.Grid.setHeader(["Name","Status"]);
  Statistics.Grid.setColumnIds('NAME,STATUS')
  Statistics.Grid.setColTypes("ro,ro");
  Statistics.Grid.attachHeader("#text_filter,#text_filter");
  Statistics.Grid.setInitWidths('*,100');
  Statistics.Grid.init();
});
