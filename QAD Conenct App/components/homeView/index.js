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
                    url: dataProvider.url
                }
            },

            schema: {
                data: '',
                model: {
                    fields: {
                        'Text': {
                            field: 'Text',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        homeViewModel = kendo.observable({
            dataSource: dataSource
        });

    parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel