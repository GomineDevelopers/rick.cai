var summaryViewModel = function () {
    this.content = ko.observable("");
};

var svModel = new summaryViewModel();
ko.applyBindings(svModel);

var getSummary = function () {
    $.get(g_restUrl + "home/content/page/id/1", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                ko.mapping.fromJS(returnData.data.data, {}, svModel);
                CommonTools.getAutoHeight($('#auto-content'));
            }
        }
        else {
            console.log("商会简介获取有错误");
        }
    });
};

$(function () {
    getSummary();
});