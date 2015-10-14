'use strict';

app.dataListView = kendo.observable({
    onShow: function() {},
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
        dataListViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/dataListView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = dataListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Text) {
                    itemModel.Text = String.fromCharCode(160);
                }
                dataListViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('dataListViewModel', dataListViewModel);
})(app.dataListView);

// START_CUSTOM_CODE_dataListViewModel
// END_CUSTOM_CODE_dataListViewModel