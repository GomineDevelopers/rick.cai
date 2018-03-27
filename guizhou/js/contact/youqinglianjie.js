var getLink = function () {
    var pageInfo = {
        limit: 8,
        page: lvModel.currentPage()
    };
    $.get(g_restUrl + "home/content/link", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                ko.mapping.fromJS(returnData.data.list.data, {}, lvModel.links);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                lvModel.totalPage(returnData.data.list.last_page);
                lvModel.updatePages();
            }
            CommonTools.getAutoHeight($('.mt-self'));
        }
        else {
            console.log("友情链接获取有错误");
        }
    });
};

var linkViewModel = function () {
    var self = this;
    self.links = ko.observableArray([]);
    CommonTools.setPages(self, ko, getLink);
};

var lvModel = new linkViewModel();
ko.applyBindings(lvModel);

$(function () {
    getLink();
});