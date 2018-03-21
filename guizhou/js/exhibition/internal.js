var internalViewModel = function () {
    var self = this;
    self.internalList1 = ko.observableArray([]);

    self.internalList2 = ko.observableArray([]);
    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);
    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./exhibitionDetail.html?id=" + v.id()+"&categoryName=国内展会";
    }
    //分页相关
    self.increasePage = function () {
        if (self.currentPage() < self.totalPage()) {
            self.currentPage(self.currentPage() + 1);
            self.updatePages();
            updateGn();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateGn();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateGn();
        }
    }

    self.updatePages = function () {
        var min = 1;
        var max = self.totalPage();
        //中间的情况
        if (self.currentPage() - min >= 2) {
            min = self.currentPage() - 2;
        }
        if (max - self.currentPage() >= 2) {
            max = self.currentPage() + 2;
        }
        //头尾
        if (self.currentPage() <= 3 && self.totalPage() <= 5) {
            max = self.totalPage();
        }
        else if (self.currentPage() <= 3 && self.totalPage() > 5) {
            max = 5;
        }
        if (self.totalPage() - self.currentPage() <= 2 && self.totalPage() - 4 > 0) {
            min = self.totalPage() - 4;
        }
        var temp = [];
        for (var i = min; i <= max; i++) {
            temp.push({pageNumber: i});
        }
        self.minPage(min);
        self.maxPage(max);
        ko.mapping.fromJS(temp, {}, gnModel.pages);
    }
}

var gnModel = new internalViewModel();

//近期
var getGnRecList = new Promise(function (resolve,reject) {
    $.get(g_restUrl+"home/content/recent", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                gnModel.internalList1 = ko.mapping.fromJS(returnData.data.list.data, mappingList);
            }

            resolve("success");
        }
        else {
            reject("failed");
            console.log("国内展会近期列表获取有错误");
        }
    });
});

//往期
var getGnForList = new Promise(function (resolve,reject) {
    var pageInfo = {
        limit: 5,
        page: gnModel.currentPage()
    };
    $.get(g_restUrl+"home/content/forward",pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                gnModel.internalList2 = ko.mapping.fromJS(returnData.data.list.data, mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.totalPage(returnData.data.list.last_page);
                gnModel.updatePages();
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("国内展会往期列表获取有错误");
        }
    });
});
var updateGn = function () {
    var pageInfo = {
        limit: 5,
        page: gnModel.currentPage(),
    };
    $.get(g_restUrl+"home/content/forward", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.totalPage(returnData.data.list.last_page);
                gnModel.updatePages();
            }
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
        }
        else {
            console.log("国内展会列表获取有错误");
        }
    });
}

$(function () {
    Promise.all([getGnRecList,getGnForList ]).then(function () {
        ko.applyBindings(gnModel);
        CommonTools.getAutoHeight($('#auto-content'));
    });
});