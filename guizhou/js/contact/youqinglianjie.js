var linkViewModel = function () {
    var self = this;
    self.links = ko.observableArray([]);
}

var lvModel = new linkViewModel();

var getLink = new Promise(function (resolve,reject) {
    $.get("http://192.168.0.191/home/content/link",function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.list && returnData.data.list.length>0){
                lvModel.links = ko.mapping.fromJS(returnData.data.list);
            }
            resolve("success");
        }
        else{
            reject("failed");
            console.log("友情链接获取有错误");
        }
    });
});

function getAutoHeight() {
    var height = $(window).height() - $('.mt-self').outerHeight() - $('.nav-footer').outerHeight() + $('#auto-content').outerHeight();
    $('#auto-content').css({
        'minHeight': height + 'px'
    })
}

$(function () {
    getLink.then(function () {
        ko.applyBindings(lvModel);
        getAutoHeight();
    })

});