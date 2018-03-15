var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var ldModel = {};

var getLegalDetail = new Promise(function (resolve, reject) {
    var url = "http://192.168.0.191/home/content/servicesdetail";
    postData = {
        id: CommonTools.getQueryVariable('id')
    }
    $.get(url, postData, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.data) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return "发布时间：" + CommonTools.formatDate(options.data);
                        }
                    }
                }
                ldModel = ko.mapping.fromJS(returnData.data.data, mappingList);
            }
            resolve("success");
        } else {
            reject("failed");
            console.log("法律详情获取有错误");
        }
    });
});


$(function () {
    getLegalDetail.then(function () {
        ko.applyBindings(ldModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});