var ndModel = {};
var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

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
                    'username': {
                        create: function (options) {
                            if(options.data == null|| options.data == ""){
                                return "发布人：未知";
                            }else{
                                return "发布人: " + options.data;
                            }
                        }
                    },
                    'source':{
                        create:function (options) {
                            if(options.data == null || options.data == ""){
                                return "来源：未知";
                            }else{
                                return "来源："+ options.data;
                            }
                        }
                    }
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

$(function () {
    getNewsDetail.then(function () {
        ko.applyBindings(ndModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});