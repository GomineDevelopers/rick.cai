var summaryViewModel = function () {
    var self = this;
    self.content = ko.observable("");
}

var svModel = new summaryViewModel();

var getSummary = new Promise(function (resolve, reject){
    $.get("http://192.168.0.191/home/content/page/id/1", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                svModel = ko.mapping.fromJS(returnData.data.data);
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("商会简介获取有错误");
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
    getSummary.then(function () {
        ko.applyBindings(svModel);
        getAutoHeight();
    })
});