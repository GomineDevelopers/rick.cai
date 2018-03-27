var categoryId = CommonTools.getQueryVariable("categoryId");

var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var getBusinessList = function () {
    var pageInfo = {
        limit: 10,
        page: bclModel.currentPage(),
        categoryId: categoryId
    };


    $.get(g_restUrl+"home/content/tradecate", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    "create_time": {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList,bclModel.businessList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bclModel.totalPage(returnData.data.list.last_page);
                bclModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        } else {
            console.log("经贸商机列表获取有错误");
        }
    });
}

var businessListViewModel = function () {
    var self = this;
    self.categoryName = categoryName;
    self.businessList = ko.observableArray([]);

    CommonTools.setPages(self,ko,getBusinessList);
}

var bclModel = new businessListViewModel();
ko.applyBindings(bclModel);

$(function () {
    getBusinessList();
});