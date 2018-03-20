var contactListViewModel = function () {
    var self = this;
    self.contactList = ko.observableArray([]);
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
            updateContactList();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateContactList();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateContactList();
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
        ko.mapping.fromJS(temp, {}, clModel.pages);
    }
}

var clModel = new contactListViewModel();

var getContactList = new Promise(function (resolve,reject) {
    var pageInfo = {
        limit: 5,
        page: clModel.currentPage()
    };
    
    $.get(g_restUrl+'home/content/communi',pageInfo,function (returnData){
        if(returnData.code && returnData.code=='200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                clModel.contactList = ko.mapping.fromJS(returnData.data.list.data);
            }
            if(returnData.data && returnData.data.list && returnData.data.list.total){
                clModel.totalPage(returnData.data.list.last_page);
                clModel.updatePages();
            }
            resolve('success');
        }else{
            reject("failed");
            console.log("会员通讯获取有错误");
        }
    });
});

var updateContactList = function () {
    var pageInfo = {
        limit: 5,
        page: clModel.currentPage()
    };
    $.get(g_restUrl+'home/content/communi',pageInfo,function (returnData){
        if(returnData.code && returnData.code=='200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                ko.mapping.fromJS(returnData.data.list.data,clModel.contactList);
            }
            if(returnData.data && returnData.data.list && returnData.data.list.total){
                clModel.totalPage(returnData.data.list.last_page);
                clModel.updatePages();
            }
        }else{
            console.log("会员通讯获取有错误");
        }
    });
}

$(function () {
    getContactList.then(function () {
        ko.applyBindings(clModel);
        CommonTools.getAutoHeight($("#auto-content"));
    })
});