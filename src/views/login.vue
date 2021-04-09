<template>
    <div class="home"></div>
</template>
<script>
import { YK_JSBridge } from '../assets/js/JSBride.js';
import { encrypt, decrypt } from '@/assets/js/utils.js';
import userCheck from '@/assets/js/userCheck.js';
export default {
    name: 'Home',
    mixins: [userCheck],
    created() {
        this.getToken(); // 获取token
    },
    methods: {
        /* 登录获取token */
        async getToken() {
            await this.getSaCode();
            const saCode = this.$store.state.saCode;
            const cryptStr = encrypt(saCode);
            const params = {
                password: cryptStr,
                employeeId: cryptStr
            };
            this.$api('/user/login', params)
                .then(res => {
                    if (res.resultCode === '1000') {
                        const token = decrypt(res.data.token);
                        this.$store.dispatch('setToken', token); // 存token
                        this.checkJumpType('login'); // 判断用户跳转
                    } else {
                        Toast(res.resultMsg);
                        setTimeout(() => {
                            YK_JSBridge.closePage();
                        }, 2000);
                    }
                })
                .catch(err => {
                    console.log(err, 'err');
                });
        },
        // 获取sacode
        async getSaCode() {
            const saCodeData = await YK_JSBridge.getGongDan(); // pc上可以先注释点
            const saCode =
                saCodeData.data.profileId || saCodeData.data.employeeId;
            this.$store.dispatch('setSaCode', saCode);
            // this.$store.dispatch('setSaCode', '10314107');
        },
        /* 获取gps */
        async getPosition() {
            const pos = await YK_JSBridge.getLocation();
            if (pos.code === 0) {
                sessionStorage.setItem('gpsLocation', JSON.stringify(pos.data));
                return pos.data;
            }
            Toast('请开启定位权限');
            setTimeout(() => {
                YK_JSBridge.closePage();
            }, 1000);
        },
        /* 获取用户信息 */
        async fetchUserInfo() {
            const pos = await this.getPosition();
            if (pos && pos.latitude !== '') {
                const res = await this.$api('/user/info', {
                    token: this.$store.state.token // token
                });
                if (res.resultCode === '1000') {
                    this.$store.dispatch('setUserInfo', res.data.employeeDTO); // 存用户信息
                } else {
                    Toast(res.resultMsg || '请求异常');
                }
            }
        },
        // 安卓手机物理返回
        backChange() {
            const path = sessionStorage.getItem('routeName');
            const fromPath = sessionStorage.getItem('fromName');
            if (path === 'Login') {
                YK_JSBridge.closePage();
            } else if (path === 'CustomerFace' && fromPath === 'Index') {
                YK_JSBridge.closePage();
            } else if (path === 'GrantList' && fromPath === 'PromoterReward') {
                this.$router.replace('/promoter');
            } else if (path === 'PromoterReward' && fromPath === 'Promoter') {
                this.$router.replace('/index');
            } else if (path === 'Promoter' && fromPath === 'Index') {
                YK_JSBridge.closePage();
            }
        }
    },
    mounted() {
        // 如果支持 popstate 一般移动端都支持了
        if (window.history && window.history.pushState) {
            // 往历史记录里面添加一条新的当前页面的url
            history.pushState(null, null, document.URL);
            // 给 popstate 绑定一个方法 监听页面刷新
            window.addEventListener('popstate', this.backChange, false); //false阻止默认事件
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
<style lang="scss">
.cancelButton {
    font-size: 16px;
    color: #7a7f85;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.confirmButton {
    font-size: 16px;
    color: #0a9c70;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.mint-msgbox {
    border-radius: 10px;
}
.mint-msgbox-message {
    font-size: 15px;
    color: #262c32;
    letter-spacing: 0;
    text-align: center;
    // line-height: 74.5px;
}
.mint-msgbox {
    width: 71%;
}
.memberList::-webkit-scrollbar {
    display: none;
}
</style>
