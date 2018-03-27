var getCommerceDynamicList = function () {
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
                ko.mapping.fromJS(returnData.data.list.data,mappingList,cdModel.commerceDynamicList);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                cdModel.totalPage(returnData.data.list.last_page);
                cdModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }else{
            console.log("商会动态列表获取有错误");
        }
    });
}

var commerceDynamicViewModel = function () {
    var self = this;
    self.commerceDynamicList = ko.observableArray([]);

    // 去详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id()+"&categoryName=商会动态";
    }
    CommonTools.setPages(self,ko,getCommerceDynamicList);
}

var cdModel = new commerceDynamicViewModel();
ko.applyBindings(cdModel);

$(function () {
   getCommerceDynamicList();
});