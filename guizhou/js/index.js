var indexViewModel = function () {
    var self = this;
    self.cates = ko.observableArray([]);
    self.newsSH = ko.observableArray([]);
    self.newsZH = ko.observableArray([]);
    self.selectedNewsId = ko.observable(2);
    self. carousel= ko.observableArray([]);
    self.changeSelectedNews = function (v) {
        self.selectedNewsId(v.id());
    }

    self.announces = ko.observableArray([]);
}

var iModel = new indexViewModel();


//获取轮播图片
var getCarousel = new Promise(function (resolve, reject) {
    $.get("http://192.168.0.191/home/content/banner", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
                iModel.carousel = ko.mapping.fromJS(returnData.data.list);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("轮播图片获取有错误");
        }
    });
});

//获取新闻中心-商会动态
var getNewsSH = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 6,
        page: 1,
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
                }
                iModel.newsSH = ko.mapping.fromJS(returnData.data.list, mappingList);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("新闻中心获取有错误");
        }
    });
});

//获取新闻中心-展会动态
var getNewsZH = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 6,
        page: 1,
        category: 3
    };
    $.get("http://192.168.0.191/home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                iModel.newsZH = ko.mapping.fromJS(returnData.data.list, mappingList);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("新闻中心获取有错误");
        }
    });
});


//获取最新公告
var getAnnounce = new Promise(function (resolve, reject) {
    $.get("http://192.168.0.191/home/content/announlists", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                iModel.announces = ko.mapping.fromJS(returnData.data.list, mappingList);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("最新公告获取有错误");
        }
    });
});

$(function () {
    Promise.all([getNewsSH, getNewsZH, getAnnounce]).then(function () {
        ko.applyBindings(iModel);
    });
});