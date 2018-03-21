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
        window.location.href = CommonTools.changeURLArg(window.location.href, 'stepId', stepId)
    }

// step1
    self.isRead = ko.observable(false);
    self.welcomeNext = function (stepId) {
        if (!self.isRead()) {
            alert("请阅读并同意贵州国际商会会员须知！");
        }
        else {
            self.setStepId(2);
        }
    }

// step2
    self.username = ko.observable("").extend({
        required: {params: true, message: "用户名不能为空"},
        minLength: {params: 2, message: "用户名不能少于2位字符"},
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

    self.errors1 = ko.validation.group({username: self.username, password: self.password, repassword: self.repassword});

    self.registerNext = function (stepId) {
        if (jModel.errors1().length == 0) {
            var params = {
                url: 'register.html',
                type: 'post',
                data: {username: self.username(), password: self.password(), repassword: self.repassword()},
                tokenFlag: true,
                sCallback: function (res) {
                    if (res && res.code == 200) {
                        CommonTools.setLocalStorage('token', res.token);
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
            jModel.errors1.showAllMessages();
        }
    }

// step3-1
    self.companyName = ko.observable("").extend({required: {param: true, message: '企业名称不能为空'}});
    self.companyEnName = ko.observable();
    self.creditCode = ko.observable("").extend({required: {param: true, message: '统一信用代码/注册号不能为空'}});
    self.postCode = ko.observable();
    self.webSite = ko.observable();
    self.registeredAddress = ko.observable();
    self.locationList = [];
    self.state = ko.observable().extend({required: {param: true, message: '省不能为空'}}); //省
    self.city = ko.observable().extend({required: {param: true, message: '市不能为空'}});//市
    self.region = ko.observable().extend({required: {param: true, message: '区不能为空'}});//区
    self.officedAddress = ko.observable("").extend({required: {param: true, message: '详细地址不能为空'}});
    self.industryClassification = ko.observable();
    self.registeredCapital = ko.observable();
    self.fixedAssets = ko.observable();
    self.turnover = ko.observable("").extend({
        required: {param: true, message: '年营业额不能为空'}
    });
    self.natures = ['内资企业', '联营企业', '有限责任公司', '私营企业', '外商投资（含港澳台）', '其他类型'];
    self.selectedNature = ko.observable();
    self.introduction = ko.observable();


//step3-2
    self.legalRepresentative = ko.observable().extend({required: {param: true, message: '法人代表不能为空'}});
    self.legalPhone = ko.observable().extend({
        required: {param: true, message: '法人代表手机号不能为空'},
        validation: {
            validator: function (val) {
                return CommonTools.checkRegex("phone", val, "")
            },
            message: '请输入合法的手机号码，以“1”开头的11位数字，不要加“086”前缀',
        }
    });
    self.legalEmail = ko.observable().extend({
        validation: {
            validator: function (val) {
                return CommonTools.checkRegex("email", val, "")
            },
            message: '邮箱格式不对哦',
        }
    });

    self.fax = ko.observable();
    self.dailyName = ko.observable().extend({required: {param: true, message: '日常联系人姓名不能为空'}});
    self.dailyPhone = ko.observable().extend({
        required: {param: true, message: '日常联系人电话不能为空'},
        validation: {
            validator: function (val) {
                return CommonTools.checkRegex("phone", val, "")
            },
            message: '请输入合法的手机号码，以“1”开头的11位数字，不要加“086”前缀',
        }
    });
    self.dailyEmail = ko.observable().extend({
        required: {param: true, message: '日常联系人邮箱不能为空'},
        validation: {
            validator: function (val) {
                return CommonTools.checkRegex("email", val, "")
            },
            message: '邮箱格式不对哦',
        }
    });

//step3-3
    self.intentions = [' 副会长单位', '常务理事单位', '理事单位', '会员单位'];
    self.selectedIntention = ko.observable();
    self.services = [
        {name: "国际交流", checked: false, id: "service1"},
        {name: "行业合作", checked: false, id: "service2"},
        {name: "企业展会", checked: false, id: "service3"},
        {name: "法律咨询", checked: false, id: "service4"},
        {name: "市场信息", checked: false, id: "service5"},
        {name: "项目招商", checked: false, id: "service6"},
        {name: "其他", checked: false, id: "service7"},
    ];
    self.selectedServices = ko.observable();

    self.updateServices = function () {
        this.checked = !this.checked;
        var tmp = ""
        for (var i = 0; i < self.services.length; i++) {
            if (self.services[i].checked) {
                tmp = tmp + self.services[i].name + ";"
            }
        }
        self.selectedServices(tmp);
        return true;
    }

    self.errors2 = ko.validation.group({
        companyName: self.companyName,
        creditCode: self.creditCode,
        turnover: self.turnover,
        legalRepresentative: self.legalRepresentative,
        legalPhone: self.legalPhone,
        dailyName: self.dailyName,
        dailyPhone: self.dailyPhone,
        dailyEmail: self.dailyEmail,
        state: self.state,
        city: self.city,
        region: self.region,
        officedAddress: self.officedAddress
    });

    self.authenNext = function (stepId) {
        if (jModel.errors2().length == 0) {
            var params = {
                url: 'home/user/enterprise.html',
                type: 'post',
                tokenFlag: true,
                data: {
                    'account_name': self.companyName(),
                    'account_name_en': self.companyEnName(),
                    'registration_no': self.creditCode(),
                    'postcode': self.postCode(),
                    'official_website': self.webSite(),
                    'address': self.registeredAddress(),
                    'state_code': self.state().name,
                    'city_code': self.city().name,
                    'county_code': self.region(),
                    'detailed': self.officedAddress(),
                    'industry': self.industryClassification(),
                    'capital': self.registeredCapital(),
                    'assets': self.fixedAssets(),
                    'business': self.turnover(),
                    'nature': self.selectedNature(),
                    'content': self.introduction(),

                    'legal_person': self.legalRepresentative(),
                    'legal_person_phone': self.legalPhone(),
                    'legal_person_email': self.legalEmail(),
                    'fax': self.fax(),
                    'daily': self.dailyName(),
                    'daily_phone': self.dailyPhone(),
                    'daily_email': self.dailyEmail(),

                    'intention': self.selectedIntention(),
                    'provide': self.selectedServices()
                },
                sCallback: function (res) {
                    if (res && res.code == 200) {
                        self.setStepId(4);
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
            jModel.errors2.showAllMessages();
        }
    }

    self.authenExit = function (stepId) {
        window.location.href = "../../html/login.html";
    }

// step4
    self.file1 = ko.observable("").extend({
        required: {params: true, message: "请上传营业执照"},
    });
    self.file2 = ko.observable("").extend({
        required: {params: true, message: "请上传法人身份证"},
    });
    self.file3 = ko.observable("").extend({
        required: {params: true, message: "请上传经办人身份证"},
    });
    self.errors3 = ko.validation.group({file1: self.file1, file2: self.file2, file3: self.file3});

    self.uploadNext = function (stepId) {
        if (jModel.errors3().length == 0) {
            var params = {
                url: 'home/user/credentials',
                type: 'post',
                tokenFlag: true,
                data: {
                    'file1': self.file1(),
                    'file2': self.file2(),
                    'file3': self.file3(),
                },
                sCallback: function (res) {
                    if (res && res.code == 200) {
                        self.setStepId(5);
                    }
                    else {
                        alert(res.msg);
                    }
                },
                eCallback: function (e) {
                    console.log("保存错误");
                }
            };
            CommonTools.getData(params);
        } else {
            jModel.errors3.showAllMessages();
        }
    }

    self.uploadBefore = function (stepId) {
        self.setStepId(3);
    }

// step5
    self.finish = function () {
        if (CommonTools.getLocalStorage("token"))
            window.location.href = "../index.html";
        else
            window.location.href = "../login.html";

    }
}

var jModel = new joinModel();

function initEasyUpload(div, txt) {
    div.easyUpload({
        allowFileTypes: '*.jpg;*.png;*.gif',//允许上传文件类型
        allowFileSize: 100000,//允许上传文件大小(KB)
        selectText: txt,//选择文件按钮文案
        multi: false,//是否允许多文件上传
        showNote: true,//是否展示文件上传说明
        note: '',//文件上传说明
        showPreview: true,//是否显示文件预览
        url: g_restUrl + 'home/user/avatar',//上传文件地址
        fileName: 'file',//文件filename配置参数
        formParam: {
            token: CommonTools.getLocalStorage('token'),//不需要验证token时可以去掉
            type: null
        },//文件filename以外的配置参数，格式：{key1:value1,key2:value2}
        timeout: 30000,//请求超时时间
        okCode: 200,//与后端返回数据code值一致时执行成功回调，不配置默认200
        successFunc: function (res) {
            if (this.formParam.type == 1) {
                jModel.file1(res.data.SaveName);
            }
            else if (this.formParam.type == 2) {
                jModel.file2(res.data.SaveName);
            }
            else if (this.formParam.type == 3) {
                jModel.file3(res.data.SaveName);
            }
            console.log('成功回调', res);
        },//上传成功回调函数
        errorFunc: function (res) {
            console.log('失败回调', res);
        },//上传失败回调函数
        deleteFunc: function (res) {
            if (this.formParam.type == 1) {
                jModel.file1("");
            }
            else if (this.formParam.type == 2) {
                jModel.file2("");
            }
            else if (this.formParam.type == 3) {
                jModel.file3("");
            }
            console.log('删除回调', res);
        }//删除文件回调函数
    });
}

var initLocation = new Promise(function (resolve, reject) {
    var params = {
        sCallback: function (data) {
            jModel.locationList = data;
            resolve('success');
        },
    };
    CommonTools.getLocation(params);
});

$(function () {
    initEasyUpload($('#file1'), '点击上传营业执照');
    initEasyUpload($('#file2'), '点击上传身份证');
    initEasyUpload($('#file3'), '点击上传身份证');
    initLocation.then(function () {
        ko.applyBindings(jModel);
        CommonTools.getAutoHeight($('#auto-content'));
    })
});

