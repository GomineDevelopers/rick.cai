var categoryId = CommonTools.getQueryVariable("categoryId");

var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var businessConListViewModel = function () {
    var self = this;
    self.categoryName = categoryName;
    self.businessConList = ko.observableArray([]);
    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);

    //分页相关
    self.increasePage = function () {
        if (self.currentPage() < self.totalPage()) {
            self.currentPage(self.currentPage() + 1);
            self.updatePages();
            updateNews();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateNews();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateNews();
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
        ko.mapping.fromJS(temp, {}, bclModel.pages);
    }
}

var bclModel = new businessConListViewModel();


var getBusinessConList = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 5,
        page: bclModel.currentPage(),
    };


    $.get("http://192.168.0.191/home/content/businesscate/category/" + categoryId, pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    "create_time": {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    "title": {
                        create: function (options) {
                            if ($(window).width() < 768) {
                                if (options.data.length <= 20) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 20) + "...";
                                }
                            } else {
                                if (options.data.length <= 50) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 50) + "...";
                                }
                            }
                        }
                    }
                }
                bclModel.businessConList = ko.mapping.fromJS(returnData.data.list.data, mappingList)
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bclModel.totalPage(returnData.data.list.last_page);
                bclModel.updatePages();
            }
            resolve("success");
        } else {
            reject("failed");
            console.log("常见问题列表获取有错误");
        }
    });
});

var updateNews = function () {
    var pageInfo = {
        limit: 5,
        page: bclModel.currentPage(),
    };
    $.get("http://192.168.0.191/home/content/certiflist", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bclczModel.totalPage(returnData.data.list.last_page);
                bclModel.updatePages();
            }
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title': {
                        create: function (options) {
                            if ($(window).width() < 768) {
                                if (options.data.length <= 20) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 20) + "...";
                                }
                            }
                            else {
                                if (options.data.length <= 50) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 50) + "...";
                                }
                            }
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, bclModel.businessConList);
            }
        }
        else {
            console.log("常见问题获取有错误");
        }
    });
}

function getAutoHeight() {
    var height = $(window).height() - $('.mt-self').outerHeight() - $('.nav-footer').outerHeight() + $('#auto-content').outerHeight();
    $('#auto-content').css({
        'minHeight': height + 'px'
    })
}

$(function () {
    getBusinessConList.then(function () {
        ko.applyBindings(bclModel);
        getAutoHeight();
    })
});