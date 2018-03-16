var businessListViewModel = function () {
    var self = this;
    self.businessList1 = ko.observableArray([]);
    self.businessList2 = ko.observableArray([]);
    self.businessList3 = ko.observableArray([]);
    self.businessList4 = ko.observableArray([]);
    self.businessList = ko.observableArray([ self.businessList1,  self.businessList2, self.businessList3,  self.businessList4]);
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
                }
                for (var i = 0; i <= returnData.data.list.length; i++) {
                    ko.mapping.fromJS(returnData.data.list[i], mappingList, blModel.businessList()[i]);
                }
            }
            resolve("success");
        }
        else {
            console.log(" 业务咨询获取有错误");
            reject("failed");
        }
    });
});

$(function () {
    getBusinessList.then(function () {
        ko.applyBindings(blModel);
    })
});