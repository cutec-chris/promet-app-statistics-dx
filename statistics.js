rtl.module("statistics",["System","Classes","Avamm","webrouter"],function () {
  "use strict";
  var $mod = this;
  this.ShowStatistics = function (URl, aRoute, Params) {
    pas.System.Writeln("Statistics should be shown");
  };
  $mod.$resourcestrings = {strReports: {org: "Berichte"}};
  $mod.$init = function () {
    pas.System.Writeln("Hello World from Statistics...");
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.statistics,"strReports"),"statistics",$mod.ShowStatistics);
  };
});
