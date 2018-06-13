rtl.module("statistics",["System","Classes","Avamm","webrouter","AvammForms"],function () {
  "use strict";
  var $mod = this;
  this.List = null;
  this.ShowStatistics = function (URl, aRoute, Params) {
    var aParent = undefined;
    pas.System.Writeln("Statistics should be shown");
    if (!($mod.List != null)) {
      aParent = pas.Avamm.GetAvammContainer();
      $mod.List = pas.AvammForms.TAvammListForm.$create("Create$1",[aParent,"statistics"]);
    };
  };
  $mod.$resourcestrings = {strReports: {org: "Berichte"}};
  $mod.$init = function () {
    pas.System.Writeln("Hello World from Statistics...");
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.statistics,"strReports"),"statistics",$mod.ShowStatistics);
  };
});
