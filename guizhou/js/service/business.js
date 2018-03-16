var businessListViewModel = function () {
    var self = this;
    self.businessList1 = ko.observableArray([]);
    self.businessList2 = ko.observableArray([]);
    self.businessList = ko.observableArray([ self.businessList1,  self.businessList2]);

    // 去商机详情页面
    self.goMore = function (v) {
        window.location.href = "./businessDetail.html?id=" + v.id();
    }
}

var blModel = new businessListViewModel();



var getBusinessList = new Promise(function (resolve, reject) {
    $.get("http://192.168.0.191/home/content/tradelist", function (returnData) {
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
        CommonTools.getAutoHeight($('.auto-content'));
    })
});