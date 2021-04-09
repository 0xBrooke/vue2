import { demoBridge } from '@/assets/js/demoBride.js';

const JSBridge = {
    faceLogin: () => {
        return new Promise((resolve, reject) => {
            const flag = true;
            if (flag) {
                resolve(flag);
            } else {
                reject();
            }
        });
    },
    /* 获取用户登陆信息 */
    getGongDan: () => {
        return new Promise((resolve, reject) => {
            GomeJSBridge.isLogin(
                data => {
                    if (data.isLogined === 'Y') {
                        GomeJSBridge.getUserInfo(res => {
                            resolve({
                                code: 1,
                                data: res,
                                msg: '获取成功'
                            });
                        });
                    } else {
                        reject({ code: 0, data, msg: '获取失败' });
                    }
                },
                err => {
                    reject({ code: 0, data: err, msg: '获取失败' });
                }
            );
        });
    },
    /* 隐藏APP原生的导航头 */
    hideHeadBar: () => {
        GomeJSBridge.hideHeadBar(
            data => {
                if (data.isSuccessed === 'Y') {
                    console.log('headBar隐藏成功');
                }
            },
            err => {
                console.log('headBar隐藏失败', err);
            }
        );
    },
    /* 获取sid:国美在线从服务口端获取cookie */
    login: () => {
        return new Promise((resolve, reject) => {
            GomeJSBridge.isLogin(
                res => {
                    // 登陆状态
                    if (res.isLogined === 'Y') {
                        resolve({ code: 1, data: res, msg: '已登录' });
                    }
                    if (res.isLogined === 'N') {
                        GomeJSBridge.login({
                            refresh: true
                        });
                        reject({ code: 0, data: {}, msg: '未登录' });
                    }
                },
                err => {
                    console.log(err, 'error');
                    reject({ code: 0, data: {}, msg: '失败' });
                }
            );
        });
    },
    /* 获取公共参数 */
    commonParams: callback => {
        GomeJSBridge.getDeviceId(data => {
            const version = GomeJSBridge.appVersion;
            const common = {
                appPlatform: data.platform,
                appSystem: data.version,
                appDeviceType: data.model,
                appVersion: version
            };
            callback && callback(common);
        }, null);
    },
    /* 调起本地本地相册和相机 */
    callPhoto: (type, callback, errCallBack, errCallBack2) => {
        GomeJSBridge.callPhotoComp(data => {
            switch (data.result) {
                case '0': //成功
                    if (data.images) {
                        callback && callback(data.images[0].imageData);
                    }
                    break;
                case '1': //取消
                    errCallBack && errCallBack();
                    break;
                case '2': //失败
                    errCallBack && errCallBack();
                    break;
                case '3': //无权限失败---拍照和存储空间权限
                    errCallBack2 && errCallBack2();
                    break;
                case '4':
                    errCallBack2 && errCallBack2();
                    break;
                case '5':
                    errCallBack2 && errCallBack2();
                    break;
                case '6':
                    errCallBack2 && errCallBack2();
                    break;
            }
        });
    },
    /* 关闭当前webview */
    closePage: () => GomeJSBridge.popWindow(),
    /* 获得网络状态 data=>object */
    getNetworkState: async callback => {
        await GomeJSBridge.getNetworkType(data => {
            let result;
            /* 网络连接方式：0-无网络，1-WiFi，2-其他网络 与国美金融保持一致 */
            switch (data.status) {
                case '2g':
                case '3g':
                case '4g':
                    result = '2';
                    break;
                case 'wifi':
                    result = '1';
                    break;
                default:
                    result = '0';
            }
            callback && callback(result);
        });
    },
    /* 调起face++;data object { busiFlowId string 业务流水号, title string 页面标题, uploadUrl faceCheck接口地址} */
    callFace: (data, callback) => {
        GomeJSBridge.plugin.extend(
            res => {
                callback && callback(res);
            },
            err => {
                callback && callback(err);
            },
            'GLinkFace',
            'beginFaceDetect',
            data
        );
    },
    /* 打开客服页面 */
    openOnlineService: () => {
        GomeJSBridge.pushWindow(
            null,
            null,
            'https://www.sobot.com/chat/h5/index.html?sysNum=c370211e8c41490eb9b7a70f741fcbbf&robotFlag=2&source=1&moduleType=3'
        );
    },
    /* 打开一个新的页面 */
    openNewWebview: url => {
        GomeJSBridge.pushWindow(null, null, url);
    },
    /* 获取用户权限状态 name: 权限名称 contact通讯录 camera拍照  photo照片 - 存储 location 定位 notification 通知 */
    getAuthorizationStatus: name => {
        return new Promise((resolve, reject) => {
            GomeJSBridge.requestAuthorization(
                data => {
                    resolve({ code: 0, data, msg: '' });
                },
                err => {
                    reject({ code: 1, data: {}, msg: err });
                },
                name
            );
        });
    },

    /* 获取经纬度 */
    getLocation: () => {
        return new Promise((resolve, reject) => {
            GomeJSBridge.getGeographyLocation(
                data => {
                    if (data.status === '0') {
                        resolve({ code: 0, data, msg: 'GPS获取成功' });
                    } else {
                        resolve({ code: 1, data, msg: 'GPS获取失败' });
                    }
                },
                err => {
                    reject({ code: 2, data: {}, msg: err });
                }
            );
        });
    },
    /* 获得设备信息 */
    getDeviceMsg: callback => {
        GomeJSBridge.getDeviceId(
            data => {
                callback && callback(data);
            },
            () => {}
        );
    },
    Version: () => GomeJSBridge.appVersion,
    /* 下载,ios直接新打开webview可直接下载,安卓使用下载桥接下载 */
    downLoad: url => {
        cordova.exec(null, null, 'Route', 'openBrowser', [url]);
    },
    /* 扫一扫购物 */
    callScanComp: (callback, errcallback) => {
        GomeJSBridge.plugin.extend(
            data => {
                callback && callback(data.code);
            },
            err => {
                errcallback && errcallback(err);
            },
            'GScan',
            'showScanPage',
            {
                type: '1'
            }
        );
    },
    /* 获取设备权限状态 */
    getOnlineDeviceAuthorizationStatus(ok, fail, name) {
        GomeJSBridge.getDeviceAuthorizationStatus(
            data => {
                const res = typeof data === 'string' ? JSON.parse(data) : data;
                ok && ok(res);
            },
            err => {
                fail && fail(JSON.stringify(err));
            },
            {
                name: name
            }
        );
    }
};

const bridge = location.href.indexOf('myfen') === -1 ? demoBridge : JSBridge;
export const YK_JSBridge = bridge;
