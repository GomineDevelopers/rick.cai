var baipishuViewModel = function () {
    var self = this;
    self.baipishuList = ko.observableArray([]);
    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);

    //分页相关
    self.increasePage = function () {
        if (self.currentPage() < self.totalPage()) {
            self.currentPage(self.currentPage() + 1);
            self.updatePages();
            updateBaipishuList();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateBaipishuList();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateBaipishuList();
        }
    }

    self.updatePages = function () {
        var min = 1;
        var max = self.totalPage();
        //中间的情况
        if (self.currentPage() - min >= 2) {
            min = self.currentPage() - 2;
        }
        if (max - self.currentPage() >= 2) {
            max = self.currentPage() + 2;
        }
        //头尾
        if (self.currentPage() <= 3 && self.totalPage() <= 5) {
            max = self.totalPage();
        }
        else if (self.currentPage() <= 3 && self.totalPage() > 5) {
            max = 5;
        }
        if (self.totalPage() - self.currentPage() <= 2 && self.totalPage() - 4 > 0) {
            min = self.totalPage() - 4;
        }
        var temp = [];
        for (var i = min; i <= max; i++) {
            temp.push({pageNumber: i});
        }
        self.minPage(min);
        self.maxPage(max);
        ko.mapping.fromJS(temp, {}, bpsModel.pages);
    }
}

var bpsModel = new baipishuViewModel();

var getBaipishuList = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 10,
        page: bpsModel.currentPage()
    }
    $.get('http://192.168.0.191/home/content/paperlist', pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title': {
                        create: function (options) {
                            return CommonTools.formatText(options.data);
                        }
                    }
                }
                bpsModel.baipishuList = ko.mapping.fromJS(returnData.data.list.data, mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bpsModel.totalPage(returnData.data.list.last_page);
                bpsModel.updatePages();
            }
            resolve("success");
        } else {
            reject('failed');
            console.log('白皮书列表获取失败');
        }
    });
});

var updateBaipishuList = function () {
    var pageInfo = {
        limit: 10,
        page: bpsModel.currentPage(),
    };
    $.get("http://192.168.0.191/home/content/paperlist", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                bpsModel.totalPage(returnData.data.list.last_page);
                bpsModel.updatePages();
            }
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title': {
                        create: function (options) {
                            return CommonTools.formatText(options.data);
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, bpsModel.baipishuList);
            }
        }
        else {
            console.log("白皮书列表获取有错误");
        }
    });
}

var updateView = function () {
    var self=this;
    if (CommonTools.getLocalStorage('token')) {
        var params = {
            url: "home/content/setpaper",
            type: 'post',
            data: {id: self.id()},
            tokenFlag:true,
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
    getBaipishuList.then(function () {
        ko.applyBindings(bpsModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});