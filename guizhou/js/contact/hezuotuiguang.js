var hezuotuiguangViewModel = function () {
    var self = this;
    self.link1 = ko.observableArray([]);
    self.link2 = ko.observableArray([]);
    self.link = ko.observableArray([self.link1, self.link2]);
}

var hztgModel = new hezuotuiguangViewModel();
ko.applyBindings(hztgModel);

var getLink = function () {
    $.get(g_restUrl + "home/content/cooperation", function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.length > 0) {
                var mappingList = {
                    'img': {
                        create: function (options) {
                            return g_restUrl + options.data;
                        }
                    }
                }

                for (var i = 0; i < returnData.data.list.length; i++) {
                    ko.mapping.fromJS(returnData.data.list[i].list, mappingList, hztgModel.link()[i]);
                }
                CommonTools.getAutoHeight($('#auto-content'));
            }
        }
        else {
            console.log("数据获取有错误");
        }
    });
}


$(function () {
    getLink();
});