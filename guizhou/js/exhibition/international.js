var getGjList = function () {
    var pageInfo = {
        limit: 10,
        page: gjModel.currentPage(),
    };
    $.get(g_restUrl + "home/content/international", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return "【展览时间：" + CommonTools.formatDate(options.data) + "】";
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, gjModel.internationalList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gjModel.totalPage(returnData.data.list.last_page);
                gjModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }
        else {
            console.log("国际展会列表获取有错误");
        }
    });
};

var internationalViewModel = function () {
    var self = this;
    self.internationalList = ko.observableArray([]);
    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./exhibitionDetail.html?id=" + v.id() + "&categoryName=国际展会";
    }
    CommonTools.setPages(self, ko, getGjList);
};

var gjModel = new internationalViewModel();
ko.applyBindings(gjModel);

$(function () {
    getGjList();
});