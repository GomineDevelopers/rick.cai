var indexViewModel = function () {
    var self = this;
    self.cates = ko.observableArray([]);
    self.newsSH = ko.observableArray([]);
    self.newsZH = ko.observableArray([]);
    self.newsQY = ko.observableArray([]);
    self.newsHD = ko.observableArray([]);
    self.selectedNewsId = ko.observable(2);
    self.carousel = ko.observableArray([]);
    self.announces = ko.observableArray([]);
    self.url = ko.observable("./news/home.html");

    self.changeSelectedNews = function (v) {
        self.selectedNewsId(v.id());
        switch (self.selectedNewsId()) {
            case 2:
                self.url("./news/home.html");
                break;
            case 3:
                self.url("./news/CommerceDynamics.html");
                break;
            case 27:
                self.url("./news/companyNews.html");
                break;
            case 28:
                self.url("./news/activityReport.html");
                break;
            default:
                self.url("./news/home.html");
        }
    }
}

var iModel = new indexViewModel();
ko.applyBindings(iModel);

//获取轮播图片
$.get(g_restUrl + "home/content/banner", function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
            ko.mapping.fromJS(returnData.data.list, {}, iModel.carousel);
        }
    }
    else {
        console.log("轮播图片获取有错误");
    }
});

//获取新闻中心-商会动态
var pageInfoSH = {
    limit: 6,
    page: 1,
    category: 2
};
$.get(g_restUrl + "home/content/newlists", pageInfoSH, function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.cate && returnData.data.cate.length > 0) {
            ko.mapping.fromJS(returnData.data.cate, {}, iModel.cates);
        }
        if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
            var mappingList = {
                'create_time': {
                    create: function (options) {
                        return CommonTools.formatDate(options.data);
                    }
                },
            }
            ko.mapping.fromJS(returnData.data.list.data, mappingList, iModel.newsSH);
        }
    }
    else {
        console.log("新闻中心获取有错误");
    }
});

//获取新闻中心-展会动态
var pageInfoZH = {
    limit: 6,
    page: 1,
    category: 3
};

$.get(g_restUrl + "home/content/newlists", pageInfoZH, function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
            var mappingList = {
                'create_time': {
                    create: function (options) {
                        return CommonTools.formatDate(options.data);
                    }
                },
            }
            ko.mapping.fromJS(returnData.data.list.data, mappingList, iModel.newsZH);
        }
    }
    else {
        console.log("新闻中心获取有错误");
    }
});

//获取新闻中心-企业资讯
var pageInfoQY = {
    limit: 6,
    page: 1,
    category: 27
};
$.get(g_restUrl + "home/content/newlists", pageInfoQY, function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
            var mappingList = {
                'create_time': {
                    create: function (options) {
                        return CommonTools.formatDate(options.data);
                    }
                },
            }
            ko.mapping.fromJS(returnData.data.list.data, mappingList, iModel.newsQY);
        }
    }
    else {
        console.log("企业资讯获取有错误");
    }
});


//获取新闻中心-活动快报
var pageInfoHD = {
    limit: 6,
    page: 1,
    category: 28
};
$.get(g_restUrl + "home/content/newlists", pageInfoHD, function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
            var mappingList = {
                'create_time': {
                    create: function (options) {
                        return CommonTools.formatDate(options.data);
                    }
                },
            }
            ko.mapping.fromJS(returnData.data.list.data, mappingList, iModel.newsHD);
        }
    }
    else {
        console.log("活动快报获取有错误");
    }
});

//获取最新公告
$.get(g_restUrl + "home/content/announlists", function (returnData) {
    if (returnData.code && returnData.code == '200') {
        if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
            var mappingList = {
                'create_time': {
                    create: function (options) {
                        return CommonTools.formatDate(options.data);
                    }
                },
            }
            ko.mapping.fromJS(returnData.data.list, mappingList, iModel.announces);
        }
    }
    else {
        console.log("最新公告获取有错误");
    }
});
