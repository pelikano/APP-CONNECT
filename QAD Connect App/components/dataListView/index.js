'use strict';

app.dataListView = kendo.observable({
    onShow: function(e) {
         localStorage.setItem("currentView", "dataListMain");         
        if (!app.data.registered) {
            // registerForPush();                     
         }
         app.dataListView.dataListViewModel.get('dataSource').read();
    },
    afterShow: function() {}
});

// START_CUSTOM_CODE_dataListView
// END_CUSTOM_CODE_dataListView
(function(parent) {
    var dataProvider = app.data.notificationProvider,    
        dataSourceOptions = {
            type: 'json',
            transport: {
                read: {
                    type: "GET",
                    beforeSend: function(req, settings) {
                        req.setRequestHeader('Authorization', "Basic " + btoa(localStorage.getItem("user") + ":" + localStorage.getItem("password")));
                        settings.url += '&inboxDomainCode=' + localStorage.getItem("domainCode") + '&inboxEntityCode=' + localStorage.getItem("entityCode");
                    },
                    url: dataProvider.url
                }
            },
            schema: {
                data: 'data',
                model: {
                    id: 'notificationId',
                    fields: {                        
                        'fromUsername': {
                            field: 'fromUser.userName',
                            defaultValue: ''
                        },                        
                        'urlText': {
                            field: 'urlText',
                            defaultValue: ''
                        },
               			'text': {
                            field: 'text',
                            defaultValue: ''
                        },
            			'timestamp': {
                            field: 'timestamp',
                            defaultValue: ''
                        },
                        'type': {
                            field: 'type',
                            defaultValue: -1
                        },
                       'read': {
                            field: 'read',
                            defaultValue: 'true'
                        }                        
                    }
                }
            }
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        dataListViewModel = kendo.observable({
            hold: function(e) {
                alert('');
                e.event.stopPropagation();
            },
            dataSource: dataSource,          
            itemClick: function(e) {
                var item = e.dataItem.uid,
                    dataSource = dataListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (itemModel.read != true) {            
                    $.ajax({    
                        beforeSend: function(req, settings) {
                            req.setRequestHeader('Authorization', "Basic " + btoa(localStorage.getItem("user") + ":" + localStorage.getItem("password")));
                        },
                        contentType: 'application/json',
                        type: 'POST',                   
                        url: "http://vmfvp02:22010/qad-central/api/qracore/inboxmarkasread?notificationId=" + itemModel.id,
                        success: function(result) {
                           dataListViewModel.get('dataSource').read();
                           app.mobileApp.pane.loader.hide(); 
                        }
                    });
                }
                app.mobileApp.navigate('#components/dataListView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                localStorage.setItem("currentView", "dataListDetail");
                var item = e.view.params.uid,
                    dataSource = dataListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.text) {
                    itemModel.text = String.fromCharCode(160);
                }
                dataListViewModel.set('currentItem', itemModel);
                
            },
            fields: {
                reply: ''
            },
            submit: function() {  
             var message = {
                comment: app.dataListView.dataListViewModel.fields.reply,
                commentTime: new Date()
            }
                $.ajax({    
                    beforeSend: function(req, settings) {
                        app.mobileApp.pane.loader.show(); 
                        req.setRequestHeader('Authorization', "Basic " + btoa(localStorage.getItem("user") + ":" + localStorage.getItem("password")));
                    },
                    contentType: 'application/json',
                    type: 'POST',                   
                    url: "http://vmfvp02:22010/qad-central/api/qracore/inboxpostcomment?notificationId=" + app.dataListView.dataListViewModel.currentItem.id +
                    "&inboxDomainCode=" + localStorage.getItem("domainCode") + "&inboxEntityCode=" + localStorage.getItem("entityCode"),
                    data: JSON.stringify(message),                    
                    success: function(result){                       
                       app.dataListView.dataListViewModel.set('fields.reply', '')
                       app.mobileApp.pane.loader.hide(); 
                    }
                });
            },
            dragging : function(e) {
              var left = e.sender.element.position().left;
              if (left <= 0) {
                e.sender.element.css("left", left + e.touch.x.delta);
              }
          
        },
        dragend : function(e) {           
          console.log(e);
          var el = e.sender.element;
          // get the listview width 
          var width = $("#itemlist").width();
          // set a threshold of 75% of the width
          var threshold = (width * .25);          
          // if the item is less than 75% of the way across, slide it out
          if (Math.abs(el.position().left) > threshold) {
            //kendo.fx(el).slideIn("right").duration(500).reverse();
            el.animate({ left: -threshold });
          }
          else {
            el.animate({ left: 0 });
          }
        },
        swipe : function(e) {
            alert("swipe");
          if (e.direction === "left") {
            var del = e.sender.element;
            kendo.fx(del).slideIn("right").duration(500).reverse();
          }
        },
        tap : function(e) {
          // make sure the initial touch wasn't on the archive button
          var initial = e.touch.initialTouch;
          var target = e.touch.currentTarget;
          console.table([{ initial: initial, target: target }]);
          // if we are tapping outside the archive area, cancel the action
          if (initial === target) 
          {
            // get the closest item and slide it back in
            var item = e.sender.element.siblings();
            item.css({ left: 0 });
            kendo.fx(item).slideIn("left").duration(500).play();
          }
          // else we are archiving so remove it
          else {
            e.sender.element.closest("li").addClass("collapsed");
          }
        },
            currentItem: null
        });
    parent.set('dataListViewModel', dataListViewModel);
})(app.dataListView);

// START_CUSTOM_CODE_dataListViewModel
// END_CUSTOM_CODE_dataListViewModel
