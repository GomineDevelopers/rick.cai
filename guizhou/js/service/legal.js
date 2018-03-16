var legalListViewModel = function () {
    var self = this;
    self.legalList1 = ko.observableArray([]);
    self.legalList2 = ko.observableArray([]);
    self.legalList3 = ko.observableArray([]);
    self.legalList4 = ko.observableArray([]);
    self.legalList = ko.observableArray([ self.legalList1,  self.legalList2, self.legalList3,  self.legalList4]);

    // 去法律详情页面
    self.goMore = function (v) {
        window.location.href = "./legalDetail.html?id=" + v.id();
    }
}

var leModel = new legalListViewModel();

var getLegalList = new Promise(function (resolve,reject) {
    $.get('http://192.168.0.191/home/content/serviceslist',function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.list && returnData.data.list.length>0){
                var mappingList = {
                    'create_time':{
                        create:function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    }
                }
                for (var i = 0; i <= returnData.data.list.length; i++) {
                    ko.mapping.fromJS(returnData.data.list[i], mappingList, leModel.legalList()[i]);
                }
            }
            resolve('success');
        }else{
            console.info('获取法律服务数据失败');
            reject('failed');
        }
    });
});

$(function () {
    getLegalList.then(function () {
        ko.applyBindings(leModel);
        CommonTools.getAutoHeight($('.auto-content'));
    })
});