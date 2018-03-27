var getCompanyNewsList = function () {
    var pageInfo = {
        limit :5,
        page: cnModel.currentPage(),
        category: 27
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
                ko.mapping.fromJS(returnData.data.list.data,mappingList,cnModel.companyNewsList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                cnModel.totalPage(returnData.data.list.last_page);
                cnModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }else{
            console.log("企业资讯列表获取有错误");
        }
    });
}

var companyNewsViewModel = function () {
    var self = this;
    self.companyNewsList = ko.observableArray([]);

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id()+"&categoryName=企业资讯";
    }

    CommonTools.setPages(self,ko,getCompanyNewsList);
}

var cnModel = new companyNewsViewModel();
ko.applyBindings(cnModel);

$(function () {
   getCompanyNewsList();
});