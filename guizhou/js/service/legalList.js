var categoryId = CommonTools.getQueryVariable("categoryId");
var categoryName = decodeURIComponent(CommonTools.getQueryVariable("categoryName"));

var getLegalList = function () {
    var pageInfo = {
        limit: 10,
        page: llModel.currentPage(),
    };
    $.get(g_restUrl+'home/content/servicesscate/category/'+categoryId,pageInfo,function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.list && returnData.data.list.data &&returnData.data.list.data.length>0){
                var mappingList = {
                    "create_time": {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                }
                ko.mapping.fromJS(returnData.data.list.data, mappingList,llModel.legalList )
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                llModel.totalPage(returnData.data.list.last_page);
                llModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }else{

            console.log("法律服务列表获取有错误");
        }
    });
}

var legalListViewModel = function () {
    var self = this;
    self.categoryName = categoryName;
    self.legalList = ko.observableArray([]);

    CommonTools.setPages(self, ko, getLegalList);
}

var llModel = new legalListViewModel();
ko.applyBindings(llModel);


$(function () {
    getLegalList();
});