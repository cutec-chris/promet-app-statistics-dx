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
    aForm.ContentForm = aForm.Form;
    aForm.DoExecute = function() {
      aForm.Tabs.tabs("content").progressOn();
      var bURL = '/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/.json';
      if (window.LoadData(bURL,function(aData){
        try {
          var reportloaded = false;
          var aData2;
          var aID;
          if ((aData)&&(aData.xmlDoc))
            if (aData.xmlDoc.responseText != '')
              aData2 = JSON.parse(aData.xmlDoc.responseText);
          if (aData2) {
            for (var i = 0; i < aData2.length; i++) {
              var aName = aData2[i].name.split('.')[0];
              if (aData2[i].name.split('.')[aData2[i].name.split('.').length - 1] == 'pdf') {
                var aUrl = GetBaseUrl()+'/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/'+aData2[i].name;
                aUrl += '?exec=1';
                aForm.ContentForm.forEachItem(function(name){
                  if (aForm.ContentForm.getUserData(name, "statistics", "n") == 'y')
                    aUrl += '&'+name+'='+aForm.ContentForm.getItemValue(name);
                });
                reportloaded = true;
                if (window.LoadData(aUrl,function(aData){
                  if ((aData)&&(aData.xmlDoc))
                    if (aData.xmlDoc.status==200) {
                      var aContent = aForm.Tabs.tabs("content");
                      aContent.attachURL(GetBaseUrl()+'/appbase/pdfview.html');
                      aForm.Tabs.attachEvent("onContentLoaded", function(id){
                        if (id=="content") {
                          var aFrame = aContent.getFrame().contentWindow;
                          try {
                            var reader = new FileReader();
                            reader.addEventListener('loadend', function() {
                              var aPdf = aFrame.loadPdf({data:this.result});
                            });
                            var aBlob = new Blob([aData.xmlDoc.response], {type: "application/octet-stream"})
                            reader.readAsArrayBuffer(aBlob); 
                          } catch(err) {
                            console.log(err.message);
                            dhtmlx.message({
                              type : "error",
                              text: err.message,
                              expire: 3000
                            });
                          }  
                        }
                      });

                    } else {
                      aForm.Tabs.tabs("content").attachHTMLString('<div id="NoContent"><p><br>Fehler beim laden des Reports</p><p>'+aData.xmlDoc.responseText+'</p></div>');
                    }
                  aForm.Tabs.tabs("content").progressOff();
                },null,"arraybuffer")==true);
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
          console.log(err.message);
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
      HasControls = false;
      aForm.ContentForm.forEachItem(function(name){
        if (aForm.Params) {
        if (aForm.ContentForm.getUserData(name, "statistics", "n") == 'y') {
          if (aForm.Params.indexOf(name+'=')>-1) {
            var tmp = aForm.Params.substring(aForm.Params.indexOf(name+'='),aForm.Params.length);
            tmp = tmp.substring(tmp.indexOf('=')+1,tmp.length);
            if (tmp.indexOf('?')>0)
              tmp = tmp.substring(0,tmp.indexOf('?'));
            aForm.ContentForm.setItemValue(name,tmp);
            if (tmp == '*') HasControls = true;
          } else {
            HasControls = true;
          }
        }
      } else {
        HasControls = true;
      }
      });
      //load Contents
      window.setTimeout(function(){
        if (!HasControls)
          aForm.DoExecute();
        },500);
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
