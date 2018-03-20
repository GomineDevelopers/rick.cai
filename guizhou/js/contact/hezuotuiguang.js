var hezuotuiguangViewModel = function () {
    var self = this;
    self.link1 = ko.observableArray([]);
    self.link2 = ko.observableArray([]);
    self.link = ko.observableArray([ self.link1,  self.link2]);
}

var hztgModel = new hezuotuiguangViewModel();

var getLink = new Promise(function (resolve,reject) {
    $.get(g_restUrl+"home/content/cooperation", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
                var mappingList = {
                    'img': {
                        create: function (options) {
                            return g_restUrl+options.data;
                        }
                    }
                }
                for (var i = 0; i <= returnData.data.list.length; i++) {
                    ko.mapping.fromJS(returnData.data.list[i],mappingList, hztgModel.link()[i]);
                }
            }
            resolve("success");
        }
        else {
            reject("failed");
            console.log("数据获取有错误");
        }
    });
});


$(function () {
    getLink.then(function () {
        ko.applyBindings(hztgModel);
        CommonTools.getAutoHeight($('#auto-content'));
    });
});