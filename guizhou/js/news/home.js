var indexViewModel = function () {
    var self = this;
    self.cates = ko.observableArray([]);
    self.news = ko.observableArray([]);
    self.selectedNewsId = ko.observable(2);
    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);
    //改变新闻类型
    self.changeSelectedNews = function (v) {
        self.selectedNewsId(v.id());
        self.currentPage(1);
        updateNews();
    }
    // 去新闻详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id();
    }
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
        ko.mapping.fromJS(temp, {}, iModel.pages);
    }
}

var iModel = new indexViewModel();
//获取新闻中心

var getNews = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 5,
        page: iModel.currentPage(),
        category: 2
    };

    $.get("http://192.168.0.191/home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.cate && returnData.data.cate.length > 0) {
                iModel.cates = ko.mapping.fromJS(returnData.data.cate);
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
                            if (options.data.length <= 20) {
                                return options.data;
                            }
                            else {
                                return options.data.substring(0, 20) + "...";
                            }
                        }
                    }
                }
                iModel.news = ko.mapping.fromJS(returnData.data.list.data, mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                iModel.totalPage(returnData.data.list.last_page);
                iModel.updatePages();
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("新闻中心获取有错误");
        }
    });
});

var updateNews = function () {
    var pageInfo = {
        limit: 5,
        page: iModel.currentPage(),
        category: iModel.selectedNewsId(),
    };
    $.get("http://192.168.0.191/home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                iModel.totalPage(returnData.data.list.last_page);
                iModel.updatePages();
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
                            if (options.data.length <= 20) {
                                return options.data;
                            }
                            else {
                                return options.data.substring(0, 20) + "...";
                            }
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, iModel.news);
            }
        }
        else {
            console.log("新闻中心获取有错误");
        }
    });
}

$(function () {
    getNews.then(function () {
        ko.applyBindings(iModel);
    })
});