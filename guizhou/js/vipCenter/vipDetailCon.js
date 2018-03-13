

var vdcModel = {};

var getVipDetailCon = new Promise(function (resolve,reject) {
    var url = 'http://192.168.0.191/home/content/informadetail/id/'+CommonTools.getQueryVariable("id");
    $.get(url,function (returnData) {
        if(returnData.code &&  returnData.code == '200'){
            if(returnData.data && returnData.data.data){
                vdcModel = ko.mapping.fromJS(returnData.data.data);
            }
            resolve('success');
        }else{
            console.log("获取会员风采详情失败");
            reject('failed');
        }
    });
});

$(function () {
    getVipDetailCon.then(function () {
        ko.applyBindings(vdcModel);
        CommonTools.getAutoHeight($("#auto-content"));
    })
});