var chuzhengDetailViewModel = function () {
    var self = this;
    self.title = ko.observable("");
    self.date = ko.observable("");
    self.content = ko.observable("");
    self.source = ko.observable("");
}

var czdModel = new chuzhengDetailViewModel();

//出证入证具体详情页
var getChuzhengDetail = new Promise(function (resolve,reject) {
    var url = "http://192.168.0.191/home/content/certifdetail/id/" + CommonTools.getQueryVariable("id");
    $.get(url,function (returnData) {
        if(returnData.code && returnData.code == '200'){
            if(returnData.data && returnData.data.data){
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return "发布时间: " + CommonTools.formatDate(options.data);
                        }
                    },
                    'source': {
                        create: function (options) {
                            return "来源: " + options.data;
                        }
                    }
                }
                czdModel = ko.mapping.fromJS(returnData.data.data, mappingList);
            }
        }else{
            reject("failed");
            console.log("出证入证详情获取有错误");
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
    getChuzhengDetail.then(function () {
        ko.applyBindings(czdModel);
        getAutoHeight();
    })
});