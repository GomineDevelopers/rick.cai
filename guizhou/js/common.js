var CommonTools = {};
var g_restUrl = 'http://192.168.0.191/api/';

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





