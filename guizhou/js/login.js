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
}

function validate() {
    var inputCode = document.getElementById("code").value.toUpperCase();
    if (inputCode.length <= 0) {
        alert("请输入验证码！");
        return false;
    } else if (inputCode != code) {
        alert("验证码输入错误！");
        createCode();
        return false;
    } else {
        alert("成功！");
        return true;
    }
}

$(function () {
    /* $(document).on('click', '#login', function () {
         validate();
         var $userName = $('#user-name'),
             $pwd = $('#user-pwd');
         if (!$userName.val()) {
             $userName.next().show().find('div').text('请输入用户名');
             return;
         }
         if (!$pwd.val()) {
             $pwd.next().show().find('div').text('请输入密码');
             return;
         }
         var params = {
             url: 'api/apptoken/get',
             type: 'post',
             data: {ac: $userName.val(), se: $pwd.val()},
             sCallback: function (res) {
                 if (res) {
                     CommonTools.setLocalStorage('token', res.token);
                     //window.location.href = 'home.html';
                 }
             },
             eCallback: function (e) {
                 if (e.status == 401) {
                     $('.error-tips').text('帐号或密码错误').show().delay(2000).hide(0);
                 }
             }
         };
         CommonTools.getData(params);
     });*/
    createCode();
});


