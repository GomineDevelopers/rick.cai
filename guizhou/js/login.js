var code;

function createCode() {

    code = new Array();
    var codeLength = 4; //验证码的长度
    var checkCode = document.getElementById("checkCode");
    checkCode.value = "";
    var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 32);
        code += selectChar[charIndex];
    }
    if (code.length != codeLength) {
        createCode();
    }
    checkCode.value = code;
    lModel.inputCode("");
}

var loginModel = function () {
    var self = this;
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
    self.inputCode = ko.observable("").extend({
        validation: {
            validator: function (val) {
                if (val && val.toUpperCase() == code.toUpperCase()) {
                    return true;
                }
                else {
                    return false;
                }
            },
            message: '验证码输入有误',
        }
    }),

        self.submit = function () {
            if (lModel.errors().length == 0) {
                var params = {
                    url: 'api/apptoken/get',
                    type: 'post',
                    data: {ac: self.username(), se: self.password()},
                    sCallback: function (res) {
                        if (res && res.code == 200) {
                            CommonTools.setLocalStorage('token', res.token);
                            window.location.href = './index.html';
                        }
                        else if (res.code == 401) {
                            alert(res.msg);
                            createCode();
                        }
                    },
                    eCallback: function (e) {
                        console.log("登陆错误");
                    }
                };
                CommonTools.getData(params);
            } else {
                createCode();
                lModel.errors.showAllMessages();
            }
        };
}

var lModel = new loginModel();

$(function () {
    createCode();
    lModel.errors = ko.validation.group(lModel);
    ko.applyBindings(lModel);
});


