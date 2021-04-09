import CryptoJS from 'crypto-js';

/* 重置用户名 */
export function formatUser(user) {
    return user;
}

/* 判断设备类型 */
const deviceCore = {
    _ua: navigator.userAgent,
    _detect: kernel => {
        let reg = new RegExp(kernel, 'img');
        return reg.test(deviceCore._ua);
    }
};

export const device = {
    isIOS: () => {
        return deviceCore._detect('iPhone|iPad|iPod|iOS|mac os');
    },
    isAndroid: () => {
        return deviceCore._detect('Android');
    },
    isWeixin: () => {
        return deviceCore._detect('MicroMessenger');
    }
};

/* 根据银行code返回银行logo */
export const bankLogoUrl = res => {
    switch (res) {
        case '00': // 支付宝
            return require('../img/bank/zhifubao@2x.png');
        case '01': // 三方收银台
            return require('../img/bank/cashier@2x.png');
        case '0102': // 工商银行
            return require('../img/bank/bank-icon/icbc@2x.png');
        case '0103': // 农业银行
            return require('../img/bank/bank-icon/abc@2x.png');
        case '0104': // 中国银行
            return require('../img/bank/bank-icon/boc@2x.png');
        case '0105': // 建设银行
            return require('../img/bank/bank-icon/ccb@2x.png');
        case '0301': // 交通银行
            return require('../img/bank/bank-icon/bocom@2x.png');
        case '0100': // 邮储银行
            return require('../img/bank/bank-icon/psbc@2x.png');
        case '0302': // 中信银行
            return require('../img/bank/bank-icon/citic@2x.png');
        case '0303': // 光大银行
            return require('../img/bank/bank-icon/ceb@2x.png');
        case '0304': // 华夏银行
            return require('../img/bank/icon-huaxia@2x.png');
        case '0305': // 民生银行
            return require('../img/bank/bank-icon/cmbc@2x.png');
        case '0306': // 广发银行
            return require('../img/bank/bank-icon/gf@2x.png');
        case '0308': // 招商银行
            return require('../img/bank/bank-icon/cmb@2x.png');
        case '0309': // 兴业银行
            return require('../img/bank/bank-icon/cib@2x.png');
        case '0310': // 浦发银行
            return require('../img/bank/bank-icon/spdb@2x.png');
        case '0316': // 浙商银行
            return require('../img/bank/bank-icon/czb@2x.png');
        case '0307': // 平安银行
        case '0410': // 平安银行
            return require('../img/bank/bank-icon/pingan@2x.png');
        case '0403': // 北京银行
            return require('../img/bank/bank-icon/bccb@2x.png');
        case '0423': // 杭州银行
            return require('../img/bank/bank-icon/hzcb@2x.png');
        case '0401': // 上海银行
            return require('../img/bank/bank-icon/bos@2x.png');
        case '0413': // 广州银行
            return require('../img/bank/bank-icon/gzbank@2x.png');
        case '0447': // 兰州银行
            return require('../img/bank/bank-icon/lzbank@2x.png');
        default:
            return require('../img/bank/bank-icon/default@2x.png');
    }
};

/* 获取urlParams */
export function getUrlParam(name, url) {
    if (typeof name !== 'string') {
        return false;
    }
    if (!url) {
        url = window.location.href;
    }
    // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
    name = name.replace(/[[]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/* 删除对象中多个属性 */
export function delObjKeys(obj, keys) {
    keys.map(function(key) {
        delete obj[key];
    });
    return obj;
}

/* 判断字符串是否为空 */
export function isEmpty(property) {
    return (
        property === null || property === '' || typeof property === 'undefined'
    );
}

/* 去除首尾中间空格 */
export const strTrim = str => {
    return str && str.replace(/\s+/gm, '');
};

/**
 * 进件校验方式跳转页面
 * 1 Face++有源
 * 2 Face++无源
 * 3 短信验证
 * 4 Face++有源+ocr
 */
export const loan_verify = {
    FACEY: '1',
    FACEN: '2',
    SMS: '3',
    FACEY_OCR: '4'
};

/**
 * 姓名校验:中文加·
 * 手机号校验:1开头的11位数字
 * 身份证校验:19位数字后面加X
 * 银行卡校验:只能输入数字
 */
export const validate = {
    name: /[^\u4E00-\u9FA5|·]/g, // 非中文输入
    mobile: /^1[3|4|5|6|7|8|9][0-9]{9}$/,
    idCard: /[\W]/, // 匹配特殊字符
    idCardReg: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    bankCardNo: /^([1-9]{1})(\d{14}|\d{18})$/ //银行卡校验
};

export const baseURL = `${location.origin + process.env.VUE_APP_BASE_URL}`;

/* 获取gps,网站必须在https下 */
export const getPosLocation = function(callback, errorCallback) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        var crd = pos.coords;
        /* 测试地址无法配置成https,原生不提供获取gps桥接,暂定方案:测试或本地环境写死经纬度,生产环境获取真实gps */
        const data = {
            latitude: `${crd.latitude}`,
            longitude: `${crd.longitude}`
        };
        callback && callback(data);
    }

    function error(err) {
        if (process.env.NODE_ENV !== 'production') {
            let data = {
                latitude: '39.959342',
                longitude: '116.46511'
            };
            if (data.latitude === '' || data.longitude === '') {
                Toast('请在手机设置中允许获取GPS定位');
            }
            callback && callback(data);
        } else {
            errorCallback && errorCallback(err);
        }
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
};

/* 格式化输入的手机号 */
export function formatMobile(e, el, val) {
    let selStart = el.selectionStart;
    let mobileLen = val.length;
    let value = getValue(e, val, 11);
    let len = value.length;
    if (len > 3 && len < 8) {
        value = value.replace(/^(\d{3})/g, '$1 ');
    } else if (len >= 8) {
        value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ');
    }
    el.value = value;
    if (selStart !== mobileLen) {
        if (selStart === 3) {
            selStart++;
        }
        el.selectionStart = el.selectionEnd = selStart;
    }
}

/* 格式化输入的银行卡号*/
export function formatCardNumber(e, el, val) {
    let selStart = el.selectionStart;
    let mobileLen = val.length;
    let value = getValue(e, val, 23);
    let len = value.length;
    if (len > 4 && len < 9) {
        value = value.replace(/^(\d{4})/g, '$1 ');
    }
    if (len >= 9 && len < 13) {
        value = value.replace(/^(\d{4})(\d{4})/g, '$1 $2 ');
    }
    if (len >= 13 && len < 17) {
        value = value.replace(/^(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3 ');
    }
    if (len >= 17 && len < 20) {
        value = value.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})/g, '$1 $2 $3 $4 ');
    }
    el.value = value;
    if (selStart !== mobileLen) {
        el.selectionStart = el.selectionEnd = selStart;
    }
}
/* 获取输入框内容(手动输入/复制粘贴) */
export function getValue(e, val) {
    let value = '';
    if (e.type === 'keyup') {
        value = val.replace(/\D/g, '');
    } else if (e.type === 'paste') {
        if (window.clipboardData && window.clipboardData.getData) {
            value = window.clipboardData.getData('Text');
        } else {
            value = e.clipboardData.getData('Text');
        }
    }
    return value;
}

/* 将数据的前三位和后三位显示出来，中间加星号*/
export function strFilter(value) {
    return value.substring(0, 3) + ' **** ' + value.substring(value.length - 4);
}

const ivString = 'meijie_2016'; // 偏移量
const keyString = 'abcdnnnnnn123456'; // 加密密钥
export const encrypt = word => {
    let ivStr = CryptoJS.MD5(ivString)
        .toString()
        .substring(8, 24);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    var key = CryptoJS.enc.Utf8.parse(keyString);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv });
    return encrypted.toString();
};
export const decrypt = word => {
    let wordNew = word ? word.replace(/[\r\n]/g, '') : '';
    let ivStr = CryptoJS.MD5(ivString)
        .toString()
        .substring(8, 24);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    var key = CryptoJS.enc.Utf8.parse(keyString);
    var decrypt = CryptoJS.AES.decrypt(wordNew, key, { iv });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
// face 检测提示对应的相关文案信息
export const faceToast = {
    1009: '人脸识别超时',
    1008: '未识别到人脸',
    1007: '检测到多张人脸',
    1006: '其他错误，请联系后台',
    1004: '其他错误，请联系后台',
    1003: '重复调用，请联系后台',
    1002: 'token 失效，请联系后台',
    1099: '人脸识别参数错误，请联系后台',
    1010: '其他错误，请联系后台'
};
// json字符串转义-->json 对象
export const jsonData = value => {
    return JSON.parse(value.replace(/'/gi, '"'));
};
// 格式化 每4位加空格
export const bankCardFormat = value => {
    // return value.replace(/(.{4})/g, '$1 ');
    return value.replace(/(\d{4})(?=\d)/g, '$1 ');
};
// 临时 test
export const idCardHead = 'test';
//格式化手机号
export function idNoFormat(tel) {
    tel =
        tel.substring(0, 3) +
        ' ' +
        tel.substring(3, 7) +
        ' ' +
        tel.substring(7, 11);
    return tel;
}
export function changeTime(time) {
    if (time) {
        let data = new Date(time);
        let year = data.getFullYear();
        let month = data.getMonth() + 1;
        let date = data.getDate();
        let hours = data.getHours();
        let minutes = data.getMinutes();
        let second = data.getSeconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (date < 10) {
            date = '0' + date;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return year + '-' + month + '-' + date;
    }
}
