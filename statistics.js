rtl.module("statistics",["System","JS","Web","Classes","Avamm","webrouter","AvammForms"],function () {
  "use strict";
  var $mod = this;
  this.Statistics = null;
  this.ShowStatistics = function (URl, aRoute, Params) {
    var aParent = null;
    pas.System.Writeln("Statistics should be shown");
    if ($mod.Statistics === null) {
      aParent = rtl.getObject(pas.Avamm.GetAvammContainer());
      $mod.Statistics = pas.AvammForms.TAvammListForm.$create("Create$1",[aParent,"statistics"]);
      $mod.Statistics.Grid.setHeader("Name,Status",",",Array.of({}));
      $mod.Statistics.Grid.setColumnIds("NAME,STATUS");
      $mod.Statistics.Grid.setColTypes("ro,ro");
      $mod.Statistics.Grid.attachHeader("#text_filter,#text_filter");
      $mod.Statistics.Grid.setInitWidths("*,100");
      $mod.Statistics.Grid.init();
    };
    $mod.Statistics.Show();
  };
  $mod.$resourcestrings = {strReports: {org: "Berichte"}};
  $mod.$init = function () {
    pas.System.Writeln("Hello World from Statistics...");
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.statistics,"strReports"),"statistics",$mod.ShowStatistics);
  };
});
