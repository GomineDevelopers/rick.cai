var CommonTools = {};
var g_restUrl = "";

if (window.location.host == "icampaign.com.cn")
    var g_restUrl = 'http://icampaign.com.cn/guizhou/useradmin/';
else
    g_restUrl = 'http://192.168.0.191/';

CommonTools.formatDate = function (date, showDetail) {
    var isShow = showDetail || false;
    var d = new Date(parseInt(date) * 1000)
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date1 = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    if (isShow)
        return year + "-" + month + "-" + date1 + " " + hour + ":" + minute + ":" + second;
    else
        return year + "-" + month + "-" + date1;
}

CommonTools.getData = function (params) {
    if (!params.type) {
        params.type = 'get';
    }
    var that = this;
    $.ajax({
        type: params.type,
        url: g_restUrl + params.url,
        data: params.data,
        beforeSend: function (XMLHttpRequest) {
            if (params.tokenFlag) {
                XMLHttpRequest.setRequestHeader('token', that.getLocalStorage('token'));
            }
        },
        success: function (res) {
            if (res.error_code && res.error_code == 10001) {
                window.location.href = 'login.html';
            }
            else {
                params.sCallback && params.sCallback(res);
            }
        },
        error: function (res) {
            params.eCallback && params.eCallback(res);
        }
    });
};

CommonTools.setLocalStorage = function (key, val) {
    var exp = new Date().getTime() + 2 * 24 * 60 * 60 * 100;  //令牌过期时间
    var obj = {
        val: val,
        exp: exp
    };
    localStorage.setItem(key, JSON.stringify(obj));
};

CommonTools.getLocalStorage = function (key) {
    var info = localStorage.getItem(key);
    if (info) {
        info = JSON.parse(info);
        if (info.exp > new Date().getTime()) {
            return info.val;
        }
        else {
            this.deleteLocalStorage('token');
            this.deleteLocalStorage('userData');
        }
    }
    return '';
}

CommonTools.deleteLocalStorage = function (key) {
    return localStorage.removeItem(key);
}

CommonTools.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

CommonTools.getAutoHeight = function (div) {
    if (div) {
        var height = $(window).height() - $('.mt-self').outerHeight() - $('.nav-footer').outerHeight() + div.outerHeight();
        div.css({
            'minHeight': height + 'px'
        })
    }
}

CommonTools.getLocation = function (params) {
    $.ajax({
        url: "../../js/location.json",//json文件位置
        type: "GET",//请求方式为get
        dataType: "json", //返回数据格式为json
        success: function (res) {//请求成功完成后要执行的方法
            params.sCallback && params.sCallback(res);
        }
    })
}

CommonTools.checkRegex = function (type, value, rule) {
    var re = ""
    if (type == "email") {
        re = /\w@\w*\.\w/;
    }
    else if (type == "phone") {
        re = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    }
    else {
        re = rule;
    }

    if (re.test(value)) {
        return true
    }
    else {
        return false
    }
}

CommonTools.changeURLArg = function (url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
}

CommonTools.logout = function () {
    CommonTools.deleteLocalStorage('token');
    CommonTools.deleteLocalStorage('userData');
    window.location.reload();
};

CommonTools.setPages = function (self, ko, method) {
    self.pages = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.totalPage = ko.observable(1);
    self.minPage = ko.observable(1);
    self.maxPage = ko.observable(1);
    //分页相关
    self.increasePage = function () {
        if (self.currentPage() < self.totalPage()) {
            self.currentPage(self.currentPage() + 1);
            self.updatePages();
            method();
        }
    }

    self.decreasePage = function () {
        if (self.currentPage() > 1) {
            self.currentPage(self.currentPage() - 1);
            self.updatePages();
            method();
        }
    }

    self.setCurrentPage = function (pageNumber) {
        if (pageNumber >= 1 && pageNumber <= self.totalPage() && pageNumber!=self.currentPage()) {
            self.currentPage(pageNumber);
            method();
        }
    }

    self.updatePages = function () {
        var min = 1;
        var max = self.totalPage();
        //中间的情况
        if (self.currentPage() - min >= 2) {
            min = self.currentPage() - 2;
        }
        if (max - self.currentPage() >= 2) {
            max = self.currentPage() + 2;
        }
        //头尾
        if (self.currentPage() <= 3 && self.totalPage() <= 5) {
            max = self.totalPage();
        }
        else if (self.currentPage() <= 3 && self.totalPage() > 5) {
            max = 5;
        }
        if (self.totalPage() - self.currentPage() <= 2 && self.totalPage() - 4 > 0) {
            min = self.totalPage() - 4;
        }
        var temp = [];
        for (var i = min; i <= max; i++) {
            temp.push({pageNumber: i});
        }
        self.minPage(min);
        self.maxPage(max);
        ko.mapping.fromJS(temp, {}, self.pages);
    }

};


$(function () {
    if (CommonTools.getLocalStorage('token') && CommonTools.getLocalStorage('userData')) {
        $("#isLogin").remove();
        $("#vipName").text(CommonTools.getLocalStorage('userData').username);
        $("#isLogout").show();
    }
    else {
        $("#isLogout").remove();
        $("#isLogin").show();
    }

    if ($("#logout")) {
        $("#logout").click(function () {
            CommonTools.logout();
        });
    }

    if ($('.fixed-top') && $('.mt-self')) {
        var topHeight = $('.fixed-top').outerHeight();
        $('.mt-self').css({
            'paddingTop': topHeight + 'px'
        })
    }
});





