var exhibitionDetailViewModel = function () {
    var self = this;
    self.url_a = ko.observable("");
    self.list = ko.observableArray([]);
    self.categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

    switch (self.categoryName) {
        case '国内展会':
            self.url_a("../exhibition/exhibitionCN.html");
            break;
        case '国际展会':
            self.url_a("../exhibition/exhibitionIN.html");
            break;
        default:
            self.url_a("../exhibition/exhibitionCN.html");
    }
};

var exdModel = new exhibitionDetailViewModel();

var getExDetail = new Promise(function (resolve, reject) {
    var url = g_restUrl + "home/content/activitydetail/id/" + CommonTools.getQueryVariable("id");
    $.get(url, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {

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

                exdModel.list = ko.mapping.fromJS(returnData.data.data, mappingList);

            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("展会详情获取有错误");
        }
    });
});

$(function () {
    getExDetail.then(function () {
        ko.applyBindings(exdModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});