var linkViewModel = function () {
    var self = this;
    self.links = ko.observableArray([]);
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
            updateLinks();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateLinks();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateLinks();
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
        ko.mapping.fromJS(temp, {}, lvModel.pages);
    }
}

var lvModel = new linkViewModel();

var getLink = new Promise(function (resolve, reject) {
    var pageInfo = {
        limit: 8,
        page: lvModel.currentPage()
    };
    $.get(g_restUrl+"home/content/link", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                lvModel.links = ko.mapping.fromJS(returnData.data.list.data, {});
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                lvModel.totalPage(returnData.data.list.last_page);
                lvModel.updatePages();
            }
            resolve("success");
        }
        else {
            console.log("友情链接获取有错误");
            reject("failed");
        }
    });
});

var updateLinks = function () {
    var pageInfo = {
        limit: 8,
        page: lvModel.currentPage(),
    };
    $.get(g_restUrl+'home/content/link', pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                lvModel.totalPage(returnData.data.list.last_page);
                lvModel.updatePages();
            }
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                ko.mapping.fromJS(returnData.data.list.data, {}, lvModel.links);
            }
        } else {
            console.log('友情链接获取有错误');
        }
    });
}

$(function () {
    getLink.then(function () {
        ko.applyBindings(lvModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })

});