var categoryId = CommonTools.getQueryVariable("categoryId");

var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var getBusinessConList =function () {
    var pageInfo = {
        limit: 10,
        page: bclModel.currentPage(),
    };

    $.get(g_restUrl+"home/content/businesscate/category/" + categoryId, pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    "create_time": {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList,bclModel.businessConList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bclModel.totalPage(returnData.data.list.last_page);
                bclModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        } else {
            console.log("常见问题列表获取有错误");
        }
    });
}

var businessConListViewModel = function () {
    var self = this;
    self.categoryName = categoryName;
    self.businessConList = ko.observableArray([]);

    CommonTools.setPages(self, ko, getBusinessConList);

}

var bclModel = new businessConListViewModel();
ko.applyBindings(bclModel);


$(function () {
    getBusinessConList();
});