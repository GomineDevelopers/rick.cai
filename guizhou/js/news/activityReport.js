var activityReportViewModel = function () {
    var self = this;
    self.activityReportList = ko.observableArray([]);

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
            updateActivityRe();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            updateActivityRe();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage()) {
            self.currentPage(pageNumber);
            updateActivityRe();
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
        ko.mapping.fromJS(temp, {}, arModel.pages);
    }
}

var arModel = new activityReportViewModel();

var getActivityReportList = new Promise(function (resolve,reject) {
    var pageInfo = {
        limit :5,
        page: arModel.currentPage(),
        category: 28
    };
    $.get('http://192.168.0.191/home/content/newlists',pageInfo,function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0){
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title':{
                        create:function (options) {
                            return CommonTools.formatText(options.data);
                        }
                    }
                }
                arModel.activityReportList = ko.mapping.fromJS(returnData.data.list.data,mappingList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                arModel.totalPage(returnData.data.list.last_page);
                arModel.updatePages();
            }
            resolve("success");
        }else{
            reject("failed");
            console.log("活动快报列表获取有错误");
        }
    });
});

var updateActivityRe = function () {
    var pageInfo = {
        limit :5,
        page: arModel.currentPage(),
        category: 28
    };
    $.get("http://192.168.0.191/home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                arModel.totalPage(returnData.data.list.last_page);
                arModel.updatePages();
            }
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title':{
                        create:function (options) {
                            return CommonTools.formatText(options.data);
                        }
                    }
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList, arModel.activityReportList);
            }
        }
        else {
            console.log("活动快报列表获取有错误");
        }
    });
}

$(function () {
   getActivityReportList.then(function () {
       ko.applyBindings(arModel);
       CommonTools.getAutoHeight($('#auto-content'));
   });
});