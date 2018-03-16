var userData = CommonTools.getLocalStorage("userData");

var vipHomeViewModel = function () {
    var self = this;
    self.username = ko.observable(userData.username);
    self.date = ko.observable(CommonTools.formatDate(userData.reg_time));
    self.type = ko.observable(3);
}

var vhModel = new vipHomeViewModel();

$(function () {
    if (!userData) {
        window.location.href = '../login.html';
    }
    ko.applyBindings(vhModel);
});