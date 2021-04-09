<template>
    <div>
        <nav-bar title="推广员奖励" @back="back"></nav-bar>
        <div class="content">
            <div class="listInfo" @click="$router.push('/promoterInfo')">
                <span>推广员信息</span>
            </div>
            <div class="listReward" @click="$router.push('/promoterReward')">
                <span>推广员奖励发放</span>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
export default {
    components: {
        NavBar
    },
    methods: {
        //返回首页
        back() {
            this.$router.push('/index');
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    height: 100%;
    padding: 10px 0px;
    background: #f3f5f7;
    position: fixed;
    .listInfo {
        width: 345px;
        height: 60px;
        background: #fff;
        margin: 0px 15px 10px 15px;
        line-height: 60px;
        position: relative;
        span {
            color: #262c32;
            font-size: 16px;
            margin-left: 41px;
            &:before {
                content: '';
                width: 18px;
                height: 18px;
                position: absolute;
                top: 20px;
                left: 16px;
                background: url('../assets/img/promoter/promoterInf.png')
                    no-repeat;
                background-size: 18px;
            }
            &:after {
                content: '';
                width: 6px;
                height: 12px;
                position: absolute;
                top: 20px;
                right: 23px;
                background: url('../assets/img/promoter/arrow.png') no-repeat;
                background-size: 6px 12px;
            }
        }
    }
    .listReward {
        width: 345px;
        height: 60px;
        background: #fff;
        margin: 0px 15px 10px 15px;
        line-height: 60px;
        position: relative;
        span {
            color: #262c32;
            font-size: 16px;
            margin-left: 41px;
            &:before {
                content: '';
                width: 18px;
                height: 18px;
                position: absolute;
                top: 20px;
                left: 16px;
                background: url('../assets/img/promoter/promoterReward.png')
                    no-repeat;
                background-size: 18px;
            }
            &:after {
                content: '';
                width: 6px;
                height: 12px;
                position: absolute;
                top: 20px;
                right: 23px;
                background: url('../assets/img/promoter/arrow.png') no-repeat;
                background-size: 6px 12px;
            }
        }
    }
}
</style>
