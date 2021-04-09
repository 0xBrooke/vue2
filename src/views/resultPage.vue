<template>
    <div>
        <nav-bar title="提交成功" @back="goBack"></nav-bar>
        <div class="content-failed">
            <img
                class="failed-img"
                src="@/assets/img/index/success.png"
                alt=""
            />
            <p>提交成功</p>
            <span class="message">礼品将在活动结束后统一发放</span>
        </div>
        <div class="footer">
            <button class="btn" @click="goBack">返回首页</button>
        </div>
    </div>
</template>
<script>
import NavBar from '@/components/common/navBar.vue';
export default {
    data() {
        return {};
    },
    components: {
        NavBar
    },
    methods: {
        goBack() {
            this.$router.push({
                name: 'Index'
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
    align-items: center;
    padding-top: 200px;
    p {
        font-size: 18px;
        margin-bottom: 10px;
        color: #333;
    }
    .failed-img {
        width: 120px;
        height: 76px;
        margin-bottom: 30px;
    }

    .message {
        font-size: 14px;
        color: #999;
    }
}
/* 底部按钮 */
.footer {
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 65px;
    padding: 10px 27.5px;
    opacity: 0.9;
    background: #fff;
    .btn {
        width: 325px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 25px;
        background-color: #0a9c70;
        font-size: 15px;
        color: #fff;
    }
}
</style>
