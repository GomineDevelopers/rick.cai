var userData = CommonTools.getLocalStorage("userData");

var vipHomeViewModel = function () {
    var self = this;
    self.username = ko.observable(userData.username);
    self.date = ko.observable(CommonTools.formatDate(userData.reg_time));
    self.oldPassword = ko.observable("").extend({
        required: {params: true, message: "原密码不能为空"},
    });
    self.newPassword = ko.observable("").extend({
        required: {params: true, message: "新密码不能为空"},
        minLength: {params: 6, message: "新密码不能少于6位字符"},
        maxLength: {params: 20, message: "新密码不能多于20位字符"},
    });
    self.newRePassword = ko.observable("").extend({
        required: {params: true, message: "确认密码不能为空"},
        validation: {
            validator: function (val) {
                if (val && val == self.newPassword()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            message: '两次密码输入不一致,请重试',
        }
    });
    self.type = ko.observable();

    self.goJoinUs = function () {
        if (self.type() == 0)
            window.location.href = "./joinUs.html?stepId=3"
        else {
            window.location.href = "./joinUs.html?stepId=4"
        }
    }

    self.post = function (stepId) {
        if (vhModel.errors().length == 0) {
            var params = {
                url: 'home/user/uppassword',
                type: 'post',
                data: {password: self.oldPassword(), newpassword: self.newPassword()},
                tokenFlag: true,
                sCallback: function (res) {
                    if (res && res.code == 200) {
                        alert(res.msg);
                        $('#passwordModal').modal('hide')
                    }
                    else {
                        alert(res.msg);
                    }
                },
                eCallback: function (e) {
                    console.log("注册错误");
                }
            };
            CommonTools.getData(params);
        } else {
            vhModel.errors.showAllMessages();
        }
    }
}

var vhModel = new vipHomeViewModel();

$('#passwordModal').on('hidden.bs.modal', function (e) {
    vhModel.oldPassword("");
    vhModel.newPassword("");
    vhModel.newRePassword("");
    vhModel.errors.showAllMessages(false);
})


$(function () {
    if (!userData) {
        window.location.href = '../login.html';
    }
    else {
        var getType = new Promise(function (resolve, reject) {
            {
                var params = {
                    url: 'home/user/getreviewstatus',
                    type: 'get',
                    tokenFlag: true,
                    sCallback: function (res) {
                        if (res && res.code == 200) {
                            vhModel.type(res.data.data.review_status);
                            resolve('success');
                        }
                        else {
                            alert("登陆已过期，请重新登陆");
                            CommonTools.logout();
                            reject('failed');
                        }
                    },
                    eCallback: function (e) {
                        alert("服务端有错误");
                        reject('failed');
                    }
                };
                CommonTools.getData(params);
            }
        });

        getType.then(function () {
            vhModel.errors = ko.validation.group(vhModel);
            ko.applyBindings(vhModel);
        })
    }
});