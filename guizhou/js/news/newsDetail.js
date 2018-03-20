var newsDetailModel = function () {
    this.url = ko.observable("");
    this.list = ko.observableArray([]);
};

var ndModel = new newsDetailModel();
var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var getNewsDetail = new Promise(function (resolve, reject) {
    var url = g_restUrl+"home/content/newdetail/id/" + CommonTools.getQueryVariable("newsid")
    $.get(url, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                switch (returnData.data.data.category_id) {
                    case 2:
                        ndModel.url("../news/home.html");
                        break;
                    case 3:
                        ndModel.url("../news/CommerceDynamics.html");
                        break;
                    case 27:
                        ndModel.url("../news/companyNews.html");
                        break;
                    case 28:
                        ndModel.url("../news/activityReport.html");
                        break;
                    default:
                        ndModel.url("../news/home.html");
                }
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return "发布时间: " + CommonTools.formatDate(options.data);
                        }
                    },
                    'username': {
                        create: function (options) {
                            if (options.data == null || options.data == "") {
                                return "发布人：未知";
                            } else {
                                return "发布人: " + options.data;
                            }
                        }
                    },
                    'source': {
                        create: function (options) {
                            if (options.data == null || options.data == "") {
                                return "来源：未知";
                            } else {
                                return "来源：" + options.data;
                            }
                        }
                    }
                }
                ndModel.list = ko.mapping.fromJS(returnData.data.data, mappingList);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("新闻详情获取有错误");
        }
    });
});


$(function () {
    getNewsDetail.then(function () {
        ko.applyBindings(ndModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});