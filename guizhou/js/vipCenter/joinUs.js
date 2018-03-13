var joinModel = function () {
    var self = this;
    var stepId = CommonTools.getQueryVariable("stepId");
    if (stepId) {
        self.stepId = ko.observable(stepId);
    }
    else {
        self.stepId = ko.observable(1);
    }

    self.setStepId = function (stepId) {
        self.stepId(stepId);
        $(window).scrollTop(0);
    }

    // step2
    self.username = ko.observable("").extend({
        required: {params: true, message: "用户名不能为空"},
        minLength: {params: 6, message: "用户名不能少于6位字符"},
        maxLength: {params: 50, message: "用户名不能多于50位字符"},
    });
    self.password = ko.observable("").extend({
        required: {params: true, message: "密码不能为空"},
        minLength: {params: 6, message: "密码不能少于6位字符"},
        maxLength: {params: 20, message: "密码不能多于20位字符"},
    });
    self.repassword = ko.observable("").extend({
        validation: {
            validator: function (val) {
                if (val && val == self.password()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            message: '两次密码输入不一致,请重试',
        }
    });
    self.registerNext = function (stepId) {
        if (jModel.errors().length == 0) {
            var params = {
                url: 'register.html',
                type: 'post',
                data: {username: self.username(), password: self.password(), repassword: self.repassword()},
                sCallback: function (res) {
                    if (res && res.code == 200) {
                        self.setStepId(3);
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
            jModel.errors.showAllMessages();
        }

    }

    // step3

    // step4

    // step5
    self.finish = function () {
        window.location.href = "/guizhou/html/login.html";
    }


}

var jModel = new joinModel();

$(function () {
    jModel.errors = ko.validation.group(jModel);
    ko.applyBindings(jModel);
    CommonTools.getAutoHeight($('#auto-content'));
});

