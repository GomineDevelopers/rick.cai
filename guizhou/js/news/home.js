//获取新闻中心
var getNews = function () {
    var pageInfo = {
        limit: 5,
        page: iModel.currentPage(),
        category: 2
    };

    $.get(g_restUrl+"home/content/newlists", pageInfo, function (returnData) {
        if (returnData.code && returnData.code == '200') {
            if (returnData.data && returnData.data.list && returnData.data.list.data && returnData.data.list.data.length > 0) {
                var mappingList = {
                    'create_time': {
                        create: function (options) {
                            return CommonTools.formatDate(options.data);
                        }
                    },
                    'title': {
                        create: function (options) {
                            if (options.data.length <= 20) {
                                return options.data;
                            }
                            else {
                                return options.data.substring(0, 20) + "...";
                            }
                        }
                    }
                }
                 ko.mapping.fromJS(returnData.data.list.data, mappingList,iModel.news);
            }
            if (returnData.data && returnData.data.list && returnData.data.list.total) {
                iModel.totalPage(returnData.data.list.last_page);
                iModel.updatePages();
            }
            CommonTools.getAutoHeight($('#auto-content'));
        }
        else {
            console.log("新闻中心获取有错误");
        }
    });
}

var indexViewModel = function () {
    var self = this;

    self.news = ko.observableArray([]);
    self.selectedNewsId = ko.observable(2);

    //改变新闻类型
    self.changeSelectedNews = function (v) {
        self.selectedNewsId(v.id());
        self.currentPage(1);
    }
    // 去新闻详情页
    self.goDetail = function (v) {
        window.location.href = "./newsDetail.html?newsid=" + v.id()+"&categoryName=新闻资讯";
    }

    CommonTools.setPages(self,ko,getNews);
}

var iModel = new indexViewModel();
ko.applyBindings(iModel);

$(function () {
    getNews();
});