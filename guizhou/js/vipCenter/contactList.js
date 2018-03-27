var getContactList = function () {
    var pageInfo = {
        limit: 5,
        page: clModel.currentPage()
    };

    $.get(g_restUrl+'home/content/communi',pageInfo,function (returnData){
        if(returnData.code && returnData.code=='200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                ko.mapping.fromJS(returnData.data.list.data,{},clModel.contactList);
            }
            if(returnData.data && returnData.data.list && returnData.data.list.total){
                clModel.totalPage(returnData.data.list.last_page);
                clModel.updatePages();
            }
            CommonTools.getAutoHeight($("#auto-content"));
        }else{
            console.log("会员通讯获取有错误");
        }
    });
}

var contactListViewModel = function () {
    var self = this;
    self.contactList = ko.observableArray([]);


    CommonTools.setPages(self, ko, getContactList);
}

var clModel = new contactListViewModel();
ko.applyBindings(clModel);

$(function () {
    getContactList();
});