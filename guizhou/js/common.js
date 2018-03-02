var CommonTools = {};

CommonTools.getWebLanguage = function () {
    if (localStorage.getItem("web_Language") == "EN") {
        return "EN";
    }
    else {
        return "CN";
    }
}

CommonTools.setWebLanguage = function (language) {
    localStorage.setItem("web_Language", language);
}

CommonTools.formatDate = function (date, showDetail) {
    var isShow = showDetail || false;
    var d=new Date(parseInt(date) * 1000)
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




