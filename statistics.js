rtl.module("statistics",["System","JS","Web","Classes","Avamm","webrouter","AvammForms"],function () {
  "use strict";
  var $mod = this;
  this.Statistics = null;
  this.ShowStatistic = function (URl, aRoute, Params) {
    var aForm = null;
    aForm = pas.AvammForms.TAvammForm.$create("Create$1",[pas.AvammForms.TAvammFormMode.fmWindow,"statistics",Params.GetValue("Id")]);
  };
  this.ShowStatistics = function (URl, aRoute, Params) {
    var aParent = null;
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
    pas.webrouter.Router().RegisterRoute("\/statistics\/by-id\/:Id\/",$mod.ShowStatistic,false);
  };
});
//# sourceMappingURL=statistics.js.map
