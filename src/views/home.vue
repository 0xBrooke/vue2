<template>
    <div class="home"></div>
</template>
<script>
import { YK_JSBridge } from '../assets/js/JSBride.js';
import { encrypt } from '@/assets/js/utils.js';

export default {
    name: 'Home',
    computed: {
        saCode() {
            return '10299309';
            // return this.$store.getters.saCode;
        }
    },
    created() {
        this.getToken(); // 获取token
    },
    methods: {
        /* 登录获取token */
        async getToken() {
            const cryptStr = encrypt(this.saCode);
            const params = `&username=${cryptStr}&password=${cryptStr}`;
            this.$api(
                '/sm-api/oauth/token?client_id=m1&client_secret=s1&scope=write&grant_type=password' +
                    params
            ).then(res => {
                if (res.data.code === 0) {
                    const token = res.data.token;
                    this.$store.dispatch('setToken', token);
                    this.checkJumpType(); // 判断用户跳转
                } else {
                    Toast(res.data.showMsg);
                }
            });
        },
        /* face++活体检测请求 */
        faceCheck() {
            this.$api('/register/faceCheck', {
                personNo: this.$store.state.userInfo.personNo, // 销售人员编码
                imageEnv: '', // 用于假脸判断的人脸
                token: this.$store.state.userInfo.token
            }).then(res => {
                if (res.resultCode === '1000') {
                    const token = res.data.token;
                    console.log(token, 'link face token');
                } else {
                    Toast(res.resultMsg);
                }
            });
        },
        /* 获取link face token */
        getLinkFaceToken() {
            this.$api('/register/getLinkFaceToken', {
                channelId: '', // 渠道id
                ip: '', // ip
                personNo: '' // 销售人员编码
            }).then(res => {
                if (res.resultCode === '1000') {
                    const token = res.data.data.token;
                    console.log(token, 'link face token');
                } else {
                    Toast(res.resultMsg);
                }
            });
        },
        /* 校验用户四要素信息,判断跳转 */
        checkJumpType() {
            this.$api('sm-api/bangKe/userCheck', {
                optNo: this.saCode // 员工id
            }).then(res => {
                const result = res.data.data;
                if (res.data.code === 0) {
                    const jumpType = result.jumpType; // 0没有身份证和卡信息1跳转身份证上传2绑卡页面3扫脸登录
                    const queryData = {
                        idNo: result.idno || '', // 身份证号
                        idName: result.idName || '', // 姓名
                        phone: result.phone || '', // 电话号
                        bankCard: result.bankCard || '' // 银行卡号
                    };
                    if (jumpType === 0 || jumpType === 1) {
                        this.$router.replace({
                            name: 'IdCard',
                            query: queryData
                        });
                    } else if (jumpType === 2) {
                        this.$router.replace({
                            name: 'BindCard',
                            query: queryData
                        });
                    } else if (jumpType === 3) {
                        /* face扫脸登录 */
                        YK_JSBridge.faceLogin();
                    }
                } else {
                    Toast(res.data.showMsg);
                }
            });
        },
        /* 获取用户信息 */
        fetchUserInfo() {
            this.$api('sm-api/getUserInfo', {
                optNo: this.$store.getters.saCode, // 销售人员id
                deviceFingerprint: '', // 设备指纹
                userType: 'MYFEN', // 用户类型
                channelId: '222channelId' // 渠道id
                // ip: 'ip', // ip
                // longitude: this.$store.state.longitude, // 经度
                // latitude: this.$store.state.latitude, // 纬度
                // saToken: this.$store.state.token // token
            }).then(res => {
                if (res.data.code === 0) {
                    this.$store.dispatch('setUserInfo', res.data.data);
                    // const userInfo = {
                    //     personNo, // 人员编码
                    //     roleNo, // 角色编码
                    //     optRoles,
                    //     isConfirmloan,
                    //     optStatus, // 人员状态
                    //     isRenzen,
                    //     optMail,
                    //     optSex, // 性别
                    //     optName, // 姓名
                    //     optType, // 类型
                    //     isLargecashauthority, // 是否大额现金贷权限（0：否，1：是）
                    //     isTrusteeship, // 是否托管（0：不托管，1：托管）
                    //     startDate, // 入职时间
                    //     teamLeaderNo, // 团队长编码
                    //     idNo, // 身份证号码
                    //     bankCard, // 银行卡号码
                    //     bankCode, // 银行卡编码
                    //     telephone, // 手机号码
                    //     deptNo, // 机构编码
                    //     deptName, // 机构名称
                    //     bankName, // 银行名称
                    //     gwName, // 岗位信息
                    //     isBank, // Y /N
                    //     bankCard, // 银行卡号码
                    //     bankCode, // 银行卡编号
                    //     rankLevelName, // 职级名称
                    //     rankLevel // 职级
                    // };
                } else {
                    Toast(res.data.showMsg);
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
$color: #00f;

.home {
    padding: 20px;
    p {
        font-size: 14px;
        margin-bottom: 10px;
    }
}
</style>
