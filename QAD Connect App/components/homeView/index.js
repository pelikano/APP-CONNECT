'use strict';

app.homeView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_homeView
// END_CUSTOM_CODE_homeView
(function(parent) {
    var dataProvider = app.data.workspaceProvider,
        dataSourceOptions = {
            type: 'json',
            transport: {
                read: {
                    type: "GET",
                    beforeSend: function(req) {
                        req.setRequestHeader('Authorization', "Basic " + btoa(localStorage.getItem("user") + ":" + localStorage.getItem("password")));                        
                    },
                    url: dataProvider.url
                }
            },

            schema: {
                data: 'data.workspaceNotifications',
                model: {
                    id: 'workspaceName',
                    fields: {
                        'headerTitle': {
                            field: 'headerTitle',
                            defaultValue: ''
                        },
                        'unreadNotifications': {
                            field: 'unreadNotifications',
                            defaultValue: 0
                        }
                    }
                }
            }
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                localStorage.setItem("domainCode", e.dataItem.domainCode);
                localStorage.setItem("entityCode", e.dataItem.entityCode);                
                app.mobileApp.navigate('components/dataListView/view.html');
            }
        });

    parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel