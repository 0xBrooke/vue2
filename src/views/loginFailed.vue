<template>
    <div>
        <nav-bar title="登录" @back="goBack"></nav-bar>
        <div class="content-failed">
            <img
                class="failed-img"
                src="@/assets/img/index/login-failed.png"
                alt=""
            />
            <span class="message">登录失败，请联系国美分期运营人员</span>
            <span class="btn" @click="againLogin">点击重试</span>
        </div>
    </div>
</template>
<script>
import NavBar from '@/components/common/navBar.vue';
import { YK_JSBridge } from '../assets/js/JSBride.js';
export default {
    data() {
        return {};
    },
    components: {
        NavBar
    },
    mounted() {
        const msg = this.$route.query.showMsg || '失败';
        Toast(msg);
    },
    methods: {
        goBack() {
            YK_JSBridge.closePage();
        },
        againLogin() {
            this.$router.push({
                name: 'Login'
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.content-failed {
    height: calc(100vh-44px);
    background: #f3f5f7;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .failed-img {
        width: 200px;
        height: 140px;
        margin-bottom: 30px;
    }
    .btn {
        width: 150px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 20px;
        border: 1px solid #0a9c70;
        margin-top: 30px;
        font-size: 15px;
        color: #0a9c70;
    }
    .message {
        font-size: 14px;
        color: #5a6066;
    }
}
</style>
