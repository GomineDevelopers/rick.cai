var getChuZhengList = function () {
    var pageInfo = {
        limit: 5,
        page: czModel.currentPage(),
    };

    $.get(g_restUrl + "home/content/certiflist", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList,czModel.chuZhengList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                czModel.totalPage(returnData.data.list.last_page);
                czModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }
        else {
            console.log("出证认证列表获取有错误");
        }
    });
};

var chuZhengViewModel = function () {
    var self = this;
    self.chuZhengList = ko.observableArray([]);

    // 去新闻详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id();
    }
    CommonTools.setPages(self, ko, getChuZhengList);
}

var czModel = new chuZhengViewModel();
ko.applyBindings(czModel);

$(function () {
    getChuZhengList();
});