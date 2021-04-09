import { YK_JSBridge } from '@/assets/js/JSBride.js';
import { faceToast } from '@/assets/js/utils.js';
export default {
    computed: {
        token() {
            return this.$store.state.token;
        }
    },
    methods: {
        /* 校验用户四要素信息,判断跳转 */
        checkJumpType(source) {
            // console.log('saCode', this.saCode);
            this.$api('/bangKe/userCheck', {
                token: this.token // 员工id
            }).then(async res => {
                const result = res;
                if (result.resultCode === '1000') {
                    if (source === 'login') {
                        const phone = result.phone;
                        await this.fetchUserInfo(phone);
                    }
                    const jumpType = result.data.jumpType; // 0没有身份证和卡信息1跳转身份证上传2绑卡页面3扫脸登录
                    const queryData = {
                        idNo: result.idno || '', // 身份证号
                        idName: result.idName || '', // 姓名
                        phone: result.phone || '', // 电话号
                        bankCard: result.bankCard || '' // 银行卡号
                    };
                    if (jumpType === '0' || jumpType === '1') {
                        // IdCard
                        this.$router.replace({
                            name: 'IdCard',
                            query: queryData
                        });
                    } else if (jumpType === '2') {
                        this.$router.replace({
                            name: 'BindCard',
                            query: queryData
                        });
                    } else if (jumpType === '3') {
                        /* 获取linkFaceToken */
                        this.getLinkFaceToken();
                    }
                } else {
                    this.$router.push({
                        name: 'loginFailed',
                        query: { showMsg: res.resultMsg }
                    });
                }
            });
        },
        /* 获取link face token */
        async getLinkFaceToken() {
            const personNo = this.$store.state.userInfo.personNo;
            const res = await this.$api('/register/getLinkFaceToken', {
                channelId: 'MYFEN', // 渠道id
                ip: '127.0.0.1', // ip
                personNo: personNo, // 销售人员编码
                token: this.$store.state.token
            });
            if (res.resultCode === '1000') {
                const faceToken = res.data.token;
                this.$store.dispatch('setFaceToken', faceToken);
                this.faceSweep(faceToken);
            } else {
                Toast(res.data.showMsg);
            }
        },
        // 调起人脸识别
        faceSweep(faceToken) {
            const token = faceToken || sessionStorage.getItem('faceToken');
            const params = {
                token: token,
                openVideo: 0, // 是否开启视频
                openSound: 1, //是否开启音频
                openRandom: 0, //是否随机动作
                complexity: 1, // 复杂度
                outType: 'singleImg',
                sequence: ['BLINK', 'NOD', 'MOUTH', 'YAW'] // 动作
            };
            YK_JSBridge.callFace(params, res => {
                // 成功则 调用 faceCheck
                if (res.resultCode === '1000') {
                    this.faceCheck(res.arrLFImage);
                } else if (res.resultCode === '1001') {
                    // 取消 直接返回帮客app
                    YK_JSBridge.closePage();
                } else {
                    // 失败后 message 提示
                    this.faceMessage(res.resultCode);
                }
            });
        },
        /* link face活体检测 成功后，校验 */
        faceCheck(faceArrImg) {
            const imageEnv =
                faceArrImg.length > 0 ? faceArrImg[0].imageData : '';
            const { longitude, latitude } = JSON.parse(
                sessionStorage.getItem('gpsLocation')
            );
            const params = {
                channelId: 'MYFEN', // 渠道id
                ip: '127.0.0.1',
                personNo: this.$store.state.userInfo.personNo, // 销售人员编码
                imageEnv: imageEnv, // 用于假脸判断的人脸
                longitude, //经度
                latitude, // 纬度
                token: this.$store.state.token
            };
            this.$api('/register/faceCheck', params).then(res => {
                if (res.resultCode === '1000') {
                    this.$router.push({
                        name: 'Index'
                    });
                } else {
                    this.faceMessage();
                }
            });
        },
        // face Toast
        faceMessage(faceCode) {
            const message = faceToast[faceCode] || '活体校验失败,请重试';
            MessageBox({
                title: '',
                message: message,
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '重试一次',
                confirmButtonClass: 'confirmButton',
                cancelButtonClass: 'cancelButton'
            }).then(action => {
                if (action === 'confirm') {
                    // 重试一次
                    this.faceSweep();
                    // // 临时调转页
                    // this.$router.push({
                    //     name: 'Index'
                    // });
                }
                if (action === 'cancel') {
                    YK_JSBridge.closePage();
                }
            });
        }
    }
};
