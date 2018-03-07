var businessListViewModel = function () {
    var self = this;
    self.businessList1 = ko.observableArray([]);
    self.businessList2 = ko.observableArray([]);
    self.businessList3 = ko.observableArray([]);
    self.businessList4 = ko.observableArray([]);

    // 去新闻详情页
    self.goMore = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id();
    }
}

var blModel = new businessListViewModel();

var getBusinessList = new Promise(function (resolve, reject) {
    $.get("http://192.168.0.191/home/content/businesslist", function (returnData) {
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
                            if ($(window).width() < 768) {
                                if (options.data.length <= 20) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 20) + "...";
                                }
                            }
                            else {
                                if (options.data.length <= 50) {
                                    return options.data;
                                }
                                else {
                                    return options.data.substring(0, 50) + "...";
                                }
                            }
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, czModel.chuZhengList);
            }
        }
        else {
            console.log("出证认证获取有错误");
        }
    });
});


$(function () {
    getBusinessList.then(function () {
        ko.applyBindings(blModel);
    })
});