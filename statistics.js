var Statistics;
window.addEventListener('AfterLogin',function(){
  Statistics = newPrometList('statistics','Berichte');
  Statistics.Grid.setHeader(["Name","Status"]);
  Statistics.Grid.setColumnIds('NAME,STATUS')
  Statistics.Grid.setColTypes("ro,ro");
  Statistics.Grid.attachHeader("#text_filter,#text_filter");
  Statistics.Grid.setInitWidths('*,100');
  Statistics.Grid.init();
  Statistics.OnCreateForm = function(aForm) {
    aForm.Tabs.addTab(
    "content",       // id
    "Inhalt",    // tab text
    null,       // auto width
    null,       // last position
    false,      // inactive
    true);
    aForm.Tabs.tabs("content").setActive();
    aForm.Toolbar.addButton('execute', 3, 'Ausführen', 'fa fa-chart');
    aForm.Toolbar.attachEvent("onClick", function(id) {
      if (id=='execute') {
        aForm.DoExecute();
      }
    });
    aForm.ContentForm = aForm.Form;//aForm.Tabs.tabs("content").attachForm([]);
    aForm.DoExecute = function() {
      //aForm.Tabs.tabs("content").attachHTMLString('<div id="NoContent"><p><br>keine Reports vorhanden</p></div>');
      aForm.Tabs.tabs("content").progressOn();
      var bURL = '/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/.json';
      if (window.LoadData(bURL,function(aData){
        try {
          var reportloaded = false;
          if ((aData)&&(aData.xmlDoc))
          var aData2;
          var aID;
          if (aData.xmlDoc.responseText != '')
            aData2 = JSON.parse(aData.xmlDoc.responseText);
          if (aData2) {
            for (var i = 0; i < aData2.length; i++) {
              var aName = aData2[i].name.split('.')[0];
              if (aData2[i].name.split('.')[aData2[i].name.split('.').length - 1] == 'png') {
                var aUrl = GetBaseUrl()+'/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/'+aData2[i].name;
                aUrl += '?exec=1';
                aForm.ContentForm.forEachItem(function(name){
                  if (aForm.ContentForm.getUserData(name, "statistics", "n") == 'y')
                    aUrl += '&'+name+'='+aForm.ContentForm.getItemValue(name);
                });
                reportloaded = true;
                aForm.Tabs.tabs("content").attachURL(aUrl);
                aForm.Tabs.attachEvent("onContentLoaded", function() {
                  aForm.Tabs.tabs("content").progressOff();
                  var images = aForm.Tabs.tabs("content").getFrame.document.getElementsByTagName('img');
                  images[0].style.width = images[0].naturalWidth;
                });
                break;
              }
            }
          }
          if (!reportloaded) {
            aForm.Tabs.tabs("content").progressOff();
            aForm.Tabs.tabs("content").attachHTMLString('<div>kein Report gefunden !</div>');
          }
        } catch(err) {
          aForm.Tabs.tabs("content").progressOff();
          dhtmlx.message({
            type : "error",
            text: err.message,
            expire: 3000
          });
        }
      })==true);
    }
    aForm.OnDataUpdated = function(bForm) {
      var aQuery = bForm.Data.Fields.querry;
      var aRegEx = new RegExp("@(.*):(.*)@");
      var aCont = aRegEx.exec(aQuery);
      var HasControls = false;
      //remove statistic items
      aForm.ContentForm.forEachItem(function(name){
        if (aForm.ContentForm.getUserData(name, "statistics", "n") == 'y')
          aForm.ContentForm.removeItem(name);
      });
      var aHeight = 70;
      //add actual statistic items
      while ((aCont) && (aCont.length>0)) {
        aCont.remove(0);
        aForm.ContentForm.addItem(null,{type:"input",name:aCont[0],label:aCont[0],value:aCont[0],value:'*'})
        aForm.ContentForm.setUserData(aCont[0],'statistics','y');
        HasControls = true;
        aCont.remove(0);
        aCont.remove(0);
        aHeight += 70;
        aForm.Layout.cells('a').setHeight(aHeight);
      }
      //add button
      if (aForm.ContentForm != aForm.Form) {
        aForm.ContentForm.addItem(null,{type:"button",name:"execute",value:"Ausführen"})
        aForm.ContentForm.attachEvent("onButtonClick", function(id) {
          if (id=='execute') {
            aForm.DoExecute();
          }
        });
      }
      //load Contents
      if (!HasControls)
        aForm.DoExecute();
    }
  }
});
window.addEventListener('AfterLogout',function(){
  Statistics.Grid.destructor();
  Statistics.Page.remove();
  delete Statistics;
  Statistics = {};
  Statistics = null;
});
