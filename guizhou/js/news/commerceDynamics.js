var commerceDynamicViewModel = function () {
    var self = this;
    self.commerceDynamicList = ko.observableArray([]);

    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id()+"&categoryName=商会动态";
    }

    //分页相关
    self.increasePage = function () {
        if (self.currentPage() < self.totalPage()) {
            self.currentPage(self.currentPage() + 1);
            self.updatePages();
            updateCommerceDynamic();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateCommerceDynamic();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateCommerceDynamic();
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
        ko.mapping.fromJS(temp, {}, cdModel.pages);
    }
}

var cdModel = new commerceDynamicViewModel();

var getCommerceDynamicList = new Promise(function (resolve,reject) {
    var pageInfo = {
        limit :5,
        page: cdModel.currentPage(),
        category: 3
    };
    $.get(g_restUrl+'home/content/newlists',pageInfo,function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0){
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                cdModel.commerceDynamicList = ko.mapping.fromJS(returnData.data.list.data,mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                cdModel.totalPage(returnData.data.list.last_page);
                cdModel.updatePages();
            }
            resolve("success");
        }else{
            reject("failed");
            console.log("商会动态列表获取有错误");
        }
    });
});

var updateCommerceDynamic = function () {
    var pageInfo = {
        limit :5,
        page: cnModel.currentPage(),
        category: 3
    };
    $.get(g_restUrl+"home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                cdModel.totalPage(returnData.data.list.last_page);
                cdModel.updatePages();
            }
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, cdModel.commerceDynamicList);
            }
        }
        else {
            console.log("商会动态列表获取有错误");
        }
    });
}

$(function () {
   getCommerceDynamicList.then(function () {
       ko.applyBindings(cdModel);
       CommonTools.getAutoHeight($('#auto-content'));
   });
});