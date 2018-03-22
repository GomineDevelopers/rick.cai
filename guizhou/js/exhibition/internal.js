var internalViewModel = function () {
    var self = this;
    self.internalList1 = ko.observableArray([]);
    self.internalList2 = ko.observableArray([]);

    self.pages1 = {
        pages: ko.observableArray([]),
        currentPage: ko.observable(1),
        totalPage: ko.observable(1),
        minPage: ko.observable(1),
        maxPage: ko.observable(1)
    };

    self.pages2 = {
        pages: ko.observableArray([]),
        currentPage: ko.observable(1),
        totalPage: ko.observable(1),
        minPage: ko.observable(1),
        maxPage: ko.observable(1)
    };

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./exhibitionDetail.html?id=" + v.id() + "&categoryName=国内展会";
    }
    //分页相关
    self.increasePage = function (currentPages) {
        if (currentPages.currentPage() < currentPages.totalPage()) {
            currentPages.currentPage(currentPages.currentPage() + 1);
            self.updatePages(currentPages);
            updateGn();
            updateGnRec();
        }
    }

    self.decreasePage = function (currentPages) {
        if (currentPages.currentPage() > 1) {
            currentPages.currentPage(currentPages.currentPage() - 1);
            self.updatePages(currentPages);
            updateGn();
            updateGnRec();
        }
    }

    self.setCurrentPage = function (pageNumber, currentPages) {
        if (pageNumber >= 1 && pageNumber <= currentPages.totalPage()) {
            currentPages.currentPage(pageNumber);
            updateGn();
            updateGnRec();
        }
    }

    self.updatePages = function (currentPages) {
        var min = 1;
        var max = currentPages.totalPage();
        //中间的情况
        if (currentPages.currentPage() - min >= 2) {
            min = currentPages.currentPage() - 2;
        }
        if (max - currentPages.currentPage() >= 2) {
            max = currentPages.currentPage() + 2;
        }
        //头尾
        if (currentPages.currentPage() <= 3 && currentPages.totalPage() <= 5) {
            max = currentPages.totalPage();
        }
        else if (currentPages.currentPage() <= 3 && currentPages.totalPage() > 5) {
            max = 5;
        }
        if (currentPages.totalPage() - currentPages.currentPage() <= 2 && currentPages.totalPage() - 4 > 0) {
            min = currentPages.totalPage() - 4;
        }
        var temp = [];
        for (var i = min; i <= max; i++) {
            temp.push({pageNumber: i});
        }
        currentPages.minPage(min);
        currentPages.maxPage(max);
        ko.mapping.fromJS(temp, {}, currentPages.pages);
    }
}

var gnModel = new internalViewModel();

//近期
var getGnRecList = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 3,
        page: gnModel.pages1.currentPage(),
    };
    $.get(g_restUrl + "home/content/recent",pageInfo, function (returnData) {
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
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages1.totalPage(returnData.data.list.last_page,gnModel.pages1);
                gnModel.updatePages(gnModel.pages1);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("国内展会近期列表获取有错误");
        }
    });
});
var updateGnRec = function () {
    var pageInfo = {
        limit: 3,
        page: gnModel.pages1.currentPage(),
    };
    $.get(g_restUrl + "home/content/recent", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages1.totalPage(returnData.data.list.last_page,gnModel.pages1);
                gnModel.updatePages(gnModel.pages1);
            }
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
        }
        else {
            console.log("国内展会列表获取有错误");
        }
    });
}

//往期
var getGnForList = new Promise(function (resolve, reject) {
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
                gnModel.internalList2 = ko.mapping.fromJS(returnData.data.list.data, mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages2.totalPage(returnData.data.list.last_page,gnModel.pages2);
                gnModel.updatePages(gnModel.pages2);
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
        page: gnModel.pages2.currentPage(),
    };
    $.get(g_restUrl + "home/content/forward", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                gnModel.pages2.totalPage(returnData.data.list.last_page,gnModel.pages2);
                gnModel.updatePages(gnModel.pages2);
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
    Promise.all([getGnRecList, getGnForList]).then(function () {
        ko.applyBindings(gnModel);
        CommonTools.getAutoHeight($('#auto-content'));
    });
});