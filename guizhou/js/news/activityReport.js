var getActivityReportList = function () {
    var pageInfo = {
        limit :5,
        page: arModel.currentPage(),
        category: 28
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
                ko.mapping.fromJS(returnData.data.list.data,mappingList,arModel.activityReportList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                arModel.totalPage(returnData.data.list.last_page);
                arModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }else{
            console.log("活动快报列表获取有错误");
        }
    });
}

var activityReportViewModel = function () {
    var self = this;
    self.activityReportList = ko.observableArray([]);

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id()+"&categoryName=活动快报";
    }

   CommonTools.setPages(self,ko,getActivityReportList);
}

var arModel = new activityReportViewModel();
ko.applyBindings(arModel);

$(function () {
   getActivityReportList();
});