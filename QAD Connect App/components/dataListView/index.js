'use strict';

app.dataListView = kendo.observable({
    onShow: function(e) {
         localStorage.setItem("currentView", "dataListMain");
         // if (!app.data.registered) {
         //    registerForPush();           
         // }
         
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
            currentItem: null
        });
    parent.set('dataListViewModel', dataListViewModel);
})(app.dataListView);

// START_CUSTOM_CODE_dataListViewModel
// END_CUSTOM_CODE_dataListViewModel
