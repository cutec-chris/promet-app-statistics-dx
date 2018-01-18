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
    aForm.Tabs.tabs("content").attachHTMLString('<div id="NoContent"><p><br>keine Reports vorhanden</p></div>');
    aForm.Tabs.tabs("content").setActive();
    aForm.Tabs.tabs("content").progressOn();
    var bURL = '/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/.json';
    if (window.LoadData(bURL,function(aData){
      console.log("Report contents loaded");
      try {
        if ((aData)&&(aData.xmlDoc))
        var aData2;
        var aID;
        if (aData.xmlDoc.responseText != '')
          aData2 = JSON.parse(aData.xmlDoc.responseText);
        if (aData2) {
          for (var i = 0; i < aData2.length; i++) {
            var aName = aData2[i].name.split('.')[0];
            if (aData2[i].name.split('.')[aData2[i].name.split('.').length - 1] == 'pdf') {
              aForm.Tabs.tabs("content").attachURL(GetBaseUrl()+'/'+aForm.TableName+'/by-id/'+aForm.Id+'/reports/'+aData2[i].name);
              break;
            }
          }
        }
      } catch(err) {
        aForm.Tabs.tabs("content").progressOff();
      }
      aForm.Tabs.tabs("content").progressOff();
    })==true);
  }
});
