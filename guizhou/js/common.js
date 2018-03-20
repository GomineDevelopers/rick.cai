var CommonTools = {};
const g_restUrl =  'http://192.168.0.191/';
//const g_restUrl = 'http://icampaign.com.cn/guizhou/useradmin/';

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
        re = /^(0|86)?((1[358][0-9]|14[57]|17[678])[0-9]{8})|(170[059][0-9]{7})$/;
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
            CommonTools.deleteLocalStorage('token');
            CommonTools.deleteLocalStorage('userData');
            window.location.reload();
        });
    }

    if ($('.fixed-top') && $('.mt-self')) {
        var topHeight = $('.fixed-top').outerHeight();
        $('.mt-self').css({
            'paddingTop': topHeight + 'px'
        })
    }
});





