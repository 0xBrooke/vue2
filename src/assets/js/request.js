import axios from 'axios';
import store from '@/store';
import router from '@/router.js';
// import Vue from 'vue';
import { encrypt, decrypt } from '@/assets/js/utils.js';
import '@/mock';
const nodeEnv = process.env.NODE_ENV;
let isMock = process.env.VUE_APP_APIENV === 'mock';

const instance = axios.create({
    timeout: 6000 // 接口超时时间
});

export const ENVARRAY = [
    // 'sale-api1', // 10.152.17.42
    // 'sale-api2', // 10.152.17.52
    // 'sale-api3', // 10.152.36.38
    // 'sale-api4', // 10.152.36.31
    // 'sale-api5', // 10.163.1.158
    // 'sale-api6', // 10.163.1.170
    // 'sale-new' // 10.163.1.111
];

const getBaseUrl = type => {
    let NODE_ENV = 'mock';
    if (!isMock) {
        NODE_ENV =
            nodeEnv !== 'production'
                ? nodeEnv === 'test'
                    ? 'test'
                    : 'dev'
                : 'prod';
    }
    let baseUrlObj;
    if (type) {
        baseUrlObj = {
            mock: 'http://rap2api.taobao.org/app/mock/274454',
            dev: '/newapi', // 本地代理
            // test: 'http://10.163.0.32:48001',
            // test: 'http://myfen-ts.gomeuat.com.cn/smc-dev32', // 开发
            test: 'http://myfen-ts.gomeuat.com.cn/smc-dev19', // 测试
            prod: 'https://myfen.gome.com.cn'
        };
    } else {
        baseUrlObj = {
            mock: 'http://rap2api.taobao.org/app/mock/274454', // 使用mock数据
            dev: '/api', // 本地代理
            test: 'http://myfen-ts.gomeuat.com.cn/sale-api5',
            prod: 'https://myfen.gome.com.cn' // 生产接口地址公共部分
        };
    }
    instance.defaults.baseURL = baseUrlObj[NODE_ENV];
};
/* 白名单页面，无需加密解密 */
let whiteList = [
    '/sm-api/monthloan/applyingList',
    '/sm-api/monthloan/customerList',
    '/sm-api/customerList',
    '/sm-api/applyingList',
    '/sm-api/good/term/confirm',
    '/sm-api/saOrderList/query',
    '/sm-api/message/querymsglist',
    '/sm-api/consume/showPicture',
    '/sm-api/homepage/countList',
    '/sm-api/oauth/token',
    '/sm-api/qrCode/getCheckResult',
    '/sm-api/qrCode/create',
    '/sm-api/gift/gold/load',
    '/sm-api/gift/gold/save'
];
// 白名单页面，不加密切传递方式是 application/json 格式
const jsonList = ['/sm-api/good/term/confirm'];
// 不需要header信息的
const headersListNO = ['/user/login'];
// 不需要loading 效果的
const loadingNo = ['/sm-api/qrCode/getCheckResult'];

//登陆迁移到新核心
const newUrl = [
    '/user/login',
    '/bangKe/userCheck',
    '/user/info',
    '/register/faceIdCardCheck',
    '/register/saveIdCard',
    '/bankCard/bank/list',
    '/bangKe/agreementBankCardBinding',
    '/bankCard/bind/apply',
    '/fen/applyingCount',
    '/employee/queryEmployeeRelation',
    '/employee/queryEmployee',
    '/employee/addEmployeeRelation',
    '/employee/deleteEmployeeRelation',
    '/user/authority',
    '/merchant/shop/list',
    '/merchant/list',
    '/merchant/confirm',
    '/loan/merchant/preHandle',
    '/register/getLinkFaceToken',
    '/register/faceCheck'
];
// 是否属于白名单
function isWhiteList(urlName) {
    let whiteName = urlName.substring(urlName.indexOf('/sm-api'));
    if (whiteList.indexOf(whiteName) !== -1) {
        return true;
    }
    return false;
}
// headers 上设置satoken sacode
function getUserInfo(request, urlName) {
    if (newUrl.includes(urlName)) {
        request.headers.common.token = sessionStorage.getItem('token');
        request.headers.token = sessionStorage.getItem('token');
    } else {
        request.headers.common.satoken = sessionStorage.getItem('token');
        request.headers.satoken = sessionStorage.getItem('token');
        request.headers.common.sacode = JSON.parse(
            window.sessionStorage.getItem('userInfo')
        ).personNo;
        request.headers.sacode = JSON.parse(
            window.sessionStorage.getItem('userInfo')
        ).personNo;
    }
}

// 对请求参数进行加密
function setEncryption(config) {
    return new Promise(resolve => {
        config.data.jsonData = encrypt(JSON.stringify(config.data));
        resolve(config);
    });
}
// 请求拦截
instance.interceptors.request.use(
    config => {
        const urlName = String(config.url);
        if (loadingNo.indexOf(urlName) === -1) {
            store.dispatch('setLoading', true);
        }
        let type = '';
        if (newUrl.indexOf(urlName) !== -1) {
            type = 'application/json';
        } else if (jsonList.indexOf(urlName) !== -1) {
            type = 'application/json';
        } else {
            type = 'application/x-www-form-urlencoded';
            config.transformRequest = [
                function(data) {
                    // 将formData格式转换
                    let ret = '';
                    for (let it in data) {
                        ret +=
                            encodeURIComponent(it) +
                            '=' +
                            encodeURIComponent(data[it]) +
                            '&';
                    }
                    return ret;
                }
            ];
        }
        // 定义请求头参数格式
        config.headers.ContentType = type;

        if (String(headersListNO.indexOf(urlName)) === '-1') {
            // 需要加请求头的接口
            getUserInfo(config, urlName);
        }
        if (isWhiteList(urlName) || newUrl.includes(urlName)) {
            // console.log(`---请求参数(不加密)：---`);
            return config;
        }
        return setEncryption(config);
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截
instance.interceptors.response.use(
    response => {
        store.dispatch('setLoading', false);
        const urlName = String(response.config.url);
        let res;
        let url = response.config.baseURL;
        if (isWhiteList(urlName)) {
            res = response;
            if (res.data.code === 6000) {
                router.replace({ name: 'Login' });
            }
        } else if (
            newUrl.includes(urlName.split(url)[urlName.split(url).length - 1])
        ) {
            // 新核心
            res = response.data;
            if (res.resultCode === '01801010007') {
                router.replace({ name: 'Login' });
            }
        } else {
            // 参数解密
            res = resolveEncryption(response);
            // saToken 失效
            if (res.code === 6000) {
                router.replace({ name: 'Login' });
            }
        }
        return res;
    },
    error => {
        store.dispatch('setLoading', false);
        return Promise.reject(error);
    }
);

// 对响应数据进行解密
function resolveEncryption(response) {
    return JSON.parse(decrypt(response.data.data));
}
// 接口请求
export const featchH5 = (path = '', options = {}) => {
    const data = Object.assign({}, options);
    getBaseUrl(newUrl.includes(path));
    return instance.post(`${path}`, data);
};
