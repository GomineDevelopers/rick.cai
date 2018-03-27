//近期
var getGnRecList = function () {
    var pageInfo = {
        limit: 3,
        page: gnModel.pages1.currentPage(),
    };
    $.get(g_restUrl + "home/content/recent", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, gnModel.internalList1);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages1.totalPage(returnData.data.list.last_page, gnModel.pages1);
                gnModel.pages1.updatePages(gnModel.pages1);
            }
        }
        else {
            console.log("国内展会近期列表获取有错误");
        }
    });
};

//往期
var getGnForList = function () {
    var pageInfo = {
        limit: 5,
        page: gnModel.pages2.currentPage()
    };
    $.get(g_restUrl + "home/content/forward", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, gnModel.internalList2);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages2.totalPage(returnData.data.list.last_page, gnModel.pages2);
                gnModel.pages2.updatePages(gnModel.pages2);
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }
        else {
            console.log("国内展会往期列表获取有错误");
        }
    });
};

var internalViewModel = function () {
    var self = this;
    self.internalList1 = ko.observableArray([]);
    self.internalList2 = ko.observableArray([]);
    self.pages1 = {};
    self.pages2 = {};
    CommonTools.setPages(self.pages1, ko, getGnRecList);
    CommonTools.setPages(self.pages2, ko, getGnForList);

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./exhibitionDetail.html?id=" + v.id() + "&categoryName=国内展会";
    }

}

var gnModel = new internalViewModel();
ko.applyBindings(gnModel);

$(function () {
    getGnRecList();
    getGnForList();
});