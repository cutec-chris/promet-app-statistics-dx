rtl.module("statistics",["System","JS","Web","Classes","Avamm","webrouter","AvammForms","dhtmlx_base","dhtmlx_form","SysUtils"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass($mod,"TStatisticsForm",pas.AvammForms.TAvammForm,function () {
    this.$init = function () {
      pas.AvammForms.TAvammForm.$init.call(this);
      this.ContentForm = null;
    };
    this.$final = function () {
      this.ContentForm = undefined;
      pas.AvammForms.TAvammForm.$final.call(this);
    };
    this.DoLoadData = function () {
      this.CreateForm();
      this.DoOpen();
      pas.AvammForms.TAvammForm.DoLoadData.apply(this,arguments);
    };
    this.CreateForm = function () {
      var Self = this;
      function ToolbarButtonClick(id) {
        if (id === "execute") {
          Self.DoExecute();
        };
      };
      Self.Tabs.addTab("content",rtl.getResStr(pas.statistics,"strContent"),100,0,true,false);
      Self.Tabs.cells("content").hide();
      Self.Toolbar.addButton("execute",0,rtl.getResStr(pas.statistics,"strExecute"),"fa fa-pie-chart","fa fa-pie-chart");
      Self.Toolbar.attachEvent("onClick",ToolbarButtonClick);
      Self.ContentForm = Self.Form;
    };
    this.DoOpen = function () {
    };
    this.DoExecute = function () {
      var Self = this;
      function DoShowPDF(aValue) {
        var Result = undefined;
        function PDFIsLoaded() {
          var aFrame = null;
          var aRequest = null;
          aFrame = Self.Tabs.cells("content").getFrame();
          aRequest = aValue;
          Self.Tabs.cells("content").show();
          Self.Layout.progressOff();
          try {
            aFrame = aFrame.contentWindow;
            var reader = new FileReader();
            reader.addEventListener('loadend', function() {
              var aPdf = aFrame.loadPdf({data:this.result});
              aBlob = null;
              reader = null;
            });
            aBlob = null;
            var aBlob = new Blob([aRequest.response], {type: "application/octet-stream"})
            reader.readAsArrayBuffer(aBlob);
          } catch(err) {
            console.log(err.message);
            dhtmlx.message({
              type : "error",
              text: err.message,
              expire: 3000
            });
          };
        };
        var $with1 = Self.Tabs.cells("content");
        $with1.attachURL("\/appbase\/pdfview.html");
        Self.Tabs.attachEvent("onContentLoaded",PDFIsLoaded);
        return Result;
      };
      function ShowLoadingError(aValue) {
        var Result = undefined;
        Self.Layout.progressOff();
        dhtmlx.message(pas.JS.New(["type","error","text",aValue]));
        return Result;
      };
      function DoLoadPDF(aValue) {
        var Result = undefined;
        var aReports = null;
        var aName = "";
        var aExt = "";
        var aUrl = "";
        var i = 0;
        var ReportLoaded = false;
        function AddParamToUrl(aParam) {
          if (Self.ContentForm.getUserData(aParam,"statistics","n") == "y") aUrl = (((aUrl + "&") + aParam) + "=") + ("" + Self.ContentForm.getItemValue(aParam));
        };
        aReports = rtl.getObject(JSON.parse(aValue.responseText));
        for (var $l1 = 0, $end2 = aReports.length - 1; $l1 <= $end2; $l1++) {
          i = $l1;
          aName = "" + rtl.getObject(aReports[i])["name"];
          aExt = pas.System.Copy(aName,pas.System.Pos(".",aName) + 1,aName.length);
          aName = pas.System.Copy(aName,0,pas.System.Pos(".",aName) - 1);
          if (aExt === "pdf") {
            aUrl = (((("\/" + Self.FTablename) + "\/by-id\/") + ("" + Self.FID)) + "\/reports\/") + ("" + rtl.getObject(aReports[i])["name"]);
            aUrl = aUrl + "?exec=1";
            Self.ContentForm.forEachItem(AddParamToUrl);
            pas.Avamm.LoadData(aUrl,false,"text\/json",4000).then(DoShowPDF).catch(ShowLoadingError);
            ReportLoaded = true;
          };
        };
        if (!ReportLoaded) {
          Self.Layout.progressOff();
          Self.Tabs.cells("content").hide();
          dhtmlx.message(pas.JS.New(["type","warning","text",rtl.getResStr(pas.statistics,"strNoReport")]));
        };
        return Result;
      };
      Self.Layout.progressOn();
      pas.Avamm.LoadData(((("\/" + Self.FTablename) + "\/by-id\/") + ("" + Self.FID)) + "\/reports\/.json",false,"text\/json",4000).then(DoLoadPDF).catch(ShowLoadingError);
    };
  });
  this.Statistics = null;
  this.ShowStatistic = function (URl, aRoute, Params) {
    var aForm = null;
    aForm = $mod.TStatisticsForm.$create("Create$1",[pas.AvammForms.TAvammFormMode.fmWindow,"statistics",Params.GetValue("Id")]);
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
  $mod.$resourcestrings = {strReports: {org: "Berichte"}, strContent: {org: "Inhalt"}, strExecute: {org: "Ausführen"}, strNoReport: {org: "kein Bericht verfügbar !"}};
  $mod.$init = function () {
    pas.Avamm.RegisterSidebarRoute(rtl.getResStr(pas.statistics,"strReports"),"statistics",$mod.ShowStatistics);
    pas.webrouter.Router().RegisterRoute("\/statistics\/by-id\/:Id\/",$mod.ShowStatistic,false);
  };
});
//# sourceMappingURL=statistics.js.map
