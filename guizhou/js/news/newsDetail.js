var newsDetailViewModel = function () {
    var self = this;
    self.title = ko.observable("");
    self.author = ko.observable("");
    self.date = ko.observable("");
    self.detail = ko.observable("");
    self.content = ko.observable("");
}

var ndModel = new newsDetailViewModel();

var getNewsDetail = new Promise(function (resolve, reject) {
    var url = "http://192.168.0.191/home/content/newdetail/id/" + CommonTools.getQueryVariable("newsid")
    $.get(url, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return "发布时间: " + CommonTools.formatDate(options.data);
                        }
                    },
                    'author': {
                        create: function (options) {
                            debugger;
                            return "发布人: " + options.data;
                        }
                    },
                }
                ndModel = ko.mapping.fromJS(returnData.data.data, mappingList);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("新闻详情获取有错误");
        }
    });
});

function getAutoHeight() {
    var height = $(window).height() - $('.mt-self').outerHeight() - $('.nav-footer').outerHeight() + $('#auto-content').outerHeight();
    $('#auto-content').css({
        'minHeight': height + 'px'
    })
}

$(function () {
    getNewsDetail.then(function () {
        ko.applyBindings(ndModel);
        getAutoHeight();
    })
});