var getBaipishuList = function () {
    var pageInfo = {
        limit: 10,
        page: bpsModel.currentPage()
    }
    $.get(g_restUrl+'home/content/paperlist', pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList,bpsModel.baipishuList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bpsModel.totalPage(returnData.data.list.last_page);
                bpsModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        } else {
            console.log('白皮书列表获取失败');
        }
    });
}

var baipishuViewModel = function () {
    var self = this;
    self.baipishuList = ko.observableArray([]);

    self.goRegister = function () {
        window.location.href = "../vipCenter/joinUS.html";
    }

    CommonTools.setPages(self,ko,getBaipishuList);
}

var bpsModel = new baipishuViewModel();
ko.applyBindings(bpsModel);

var updateView = function () {
    var self = this;
    if (CommonTools.getLocalStorage('token')) {
        var params = {
            url: "home/content/setpaper",
            type: 'post',
            data: {id: self.id()},
            tokenFlag: true,
            sCallback: function (returnData) {
                if (returnData.code && returnData.code == '200') {
                    for (var i = 0; i < bpsModel.baipishuList().length; i++) {
                        if (bpsModel.baipishuList()[i].id() == self.id()) {
                            bpsModel.baipishuList()[i].view(bpsModel.baipishuList()[i].view() + 1);
                        }
                    }
                    window.open(self.url());
                }
                else {
                    $('#myModal').modal();
                }
            },
            eCallback: function (e) {
                $('#myModal').modal();
            }
        };
        CommonTools.getData(params);
    }
    else {
        $('#myModal').modal();
    }
}

$(function () {
    getBaipishuList();
});