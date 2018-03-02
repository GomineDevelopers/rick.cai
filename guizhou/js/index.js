
			

var indexViewModel = function () {
    var self = this;
    self.cates = ko.observableArray([]);
    self.news = ko.observableArray([]);
    self.selectedNewsId = ko.observable(2);
    self.changeSelectedNews = function (v) {
        self.selectedNewsId(v.id());
    }

    self.announces = ko.observableArray([]);
}

var iModel = new indexViewModel();
//获取新闻中心
var getNews = new Promise(function (resolve, reject) {
    $.get("http://192.168.0.191/home/content/newlists", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.cate && returnData.data.cate.length > 0) {
                iModel.cates = ko.mapping.fromJS(returnData.data.cate);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
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
                iModel.news = ko.mapping.fromJS(returnData.data.list, mappingList);
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
    Promise.all([getNews, getAnnounce]).then(function () {
        ko.applyBindings(iModel);
    });
});