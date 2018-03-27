var getdownloadList = function () {
    var pageInfo = {
        limit: 1,
        page: dModel.currentPage(),
    };

    $.get(g_restUrl+"home/content/downloadlist", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                 ko.mapping.fromJS(returnData.data.list.data, mappingList,dModel.downloadList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                dModel.totalPage(returnData.data.list.last_page);
                dModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }
        else {
            console.log("下载区获取有错误");
        }
    });
}

var downloadViewModel = function () {
    var self = this;
    self.downloadList = ko.observableArray([]);
    self.pages = ko.observableArray([]);

    CommonTools.setPages(self,ko,getdownloadList);
}

var dModel = new downloadViewModel();
ko.applyBindings(dModel);


var updateView = function () {
    var updateId = this.id()
    var postData = {id: updateId};
    window.open(this.url());
    $.post(g_restUrl+"home/content/setdownload", postData, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            for (var i = 0; i < dModel.downloadList().length; i++) {
                if (dModel.downloadList()[i].id() == updateId) {
                    dModel.downloadList()[i].view(dModel.downloadList()[i].view() + 1);
                }
            }
        }
        else {
            console.log("下载次数更新有错误");
        }
    });
}

$(function () {
    getdownloadList();
});