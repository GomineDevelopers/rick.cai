var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var bcdModel = {};

var getBusinessConDetail = new Promise(function (resolve, reject) {
    var url = "http://192.168.0.191/home/content/businessdetail/id/" + CommonTools.getQueryVariable('id');
    $.get(url, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    }
                }
                bcdModel = ko.mapping.fromJS(returnData.data.data, mappingList);
            }
            resolve("success");
        } else {
            reject("failed");
            console.log("常见问题详情获取有错误");
        }
    });
});

$(function () {
    getBusinessConDetail.then(function () {
        ko.applyBindings(bcdModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});