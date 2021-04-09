export const demoBridge = {
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
    hideHeadBar: () => {},
    getGongDan: () => {
        return new Promise((resolve, reject) => {
            const flag = true;
            if (flag) {
                resolve({
                    code: 1,
                    data: {
                        profileId: '00069373',
                        mobile: '13122112211'
                    },
                    msg: '获取成功'
                });
            } else {
                reject();
            }
        });
    },
    login: () => {},
    closePage: () => {},
    getAuthorizationStatus: () => {},
    getLocation: () => {
        return new Promise((resolve, reject) => {
            const flag = true;
            if (flag) {
                resolve({
                    code: 0,
                    data: {
                        longitude: '116.466424', // 经度
                        latitude: '39.959495' // 纬度
                    },
                    msg: 'GPS获取成功'
                });
            } else {
                reject();
            }
        });
    },
    callScanComp: () => {}
};
