<template>
    <div>
        <nav-bar title="推广员奖励" @back="back"></nav-bar>
        <div class="main">
            <ul>
                <li
                    v-for="(v, i) in nav"
                    :key="i"
                    @click="changeIndex(i)"
                    class="nav"
                    :class="{ active: navIndex === i }"
                >
                    <p class="rewardName">
                        {{ v.name }}
                    </p>
                    <span class="count" v-if="v.count > 0">
                        {{ v.count }}
                    </span>
                </li>
            </ul>
            <mt-swipe
                @change="handleChange"
                :auto="0"
                class="content"
                :continuous="false"
                :defaultIndex="navIndex"
                :showIndicators="false"
                ref="swipe"
            >
                <mt-swipe-item>
                    <ungrant :getStatus="getStatus" ref="ungrant"></ungrant>
                </mt-swipe-item>
                <mt-swipe-item>
                    <grant-fail
                        :getStatus="getStatus"
                        ref="grantFail"
                    ></grant-fail>
                </mt-swipe-item>
                <mt-swipe-item>
                    <grant :getStatus="getStatus" ref="grant"></grant>
                </mt-swipe-item>
                <mt-swipe-item>
                    <granted :getStatus="getStatus" ref="granted"></granted>
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import Ungrant from '@/components/promoterInfo/ungrant.vue';
import GrantFail from '@/components/promoterInfo/grantFail.vue';
import Grant from '@/components/promoterInfo/grant.vue';
import Granted from '@/components/promoterInfo/granted.vue';
export default {
    components: {
        NavBar,
        Ungrant,
        GrantFail,
        Grant,
        Granted
    },
    data() {
        return {
            navIndex: 0,
            nav: [
                {
                    name: '待发放',
                    count: ''
                },
                {
                    name: '发放失败',
                    count: ''
                },
                {
                    name: '发放中',
                    count: ''
                },
                {
                    name: '已发放',
                    count: ''
                }
            ]
        };
    },
    mounted() {
        this.getStatus();
    },
    methods: {
        back() {
            this.$router.push('/promoter');
        },
        //请求四种状态个数
        getStatus() {
            const data = {
                saCode: this.$store.state.userInfo.personNo
            };
            this.$api('/sm-api/rewardSum/fourStatus', data).then(res => {
                if (res.code === 0) {
                    this.count = res.data;
                    for (let i in this.nav) {
                        if (this.nav[i].name === '待发放') {
                            this.nav[i].count = Number(this.count.pendNum);
                        } else if (this.nav[i].name === '发放失败') {
                            this.nav[i].count = Number(this.count.failureNum);
                        } else if (this.nav[i].name === '发放中') {
                            this.nav[i].count = Number(this.count.issueNum);
                        } else {
                            this.nav[i].count = Number(this.count.successNum);
                        }
                    }
                }
            });
        },
        handleChange(index) {
            this.navIndex = index;
            this.getStatus();
            if (index === 0) {
                this.$refs.ungrant.rewardList = [];
                this.$refs.ungrant.curPagerNo = 1;
                this.$refs.ungrant.getRewardList();
            } else if (index === 1) {
                this.$refs.grantFail.rewardList = [];
                this.$refs.grantFail.curPagerNo = 1;
                this.$refs.grantFail.getRewardList();
            } else if (index === 2) {
                this.$refs.grant.rewardList = [];
                this.$refs.grant.curPagerNo = 1;
                this.$refs.grant.getRewardList();
            } else if (index === 3) {
                this.$refs.granted.rewardList = [];
                this.$refs.granted.curPagerNo = 1;
                this.$refs.granted.getRewardList();
            }
        },
        changeIndex(i) {
            this.navIndex = i;
            this.$refs.swipe.swipeItemCreated();
        }
    }
};
</script>

<style lang="scss">
.main {
    ul {
        display: flex;
        width: 100%;
        background: #fff;
        justify-content: center;
        text-align: center;
        position: fixed;
        li.nav {
            display: flex;
            position: fixed;
            justify-content: center;
            position: relative;
            color: #5a6066;
            font-size: 14px;
            &.active {
                font-size: 14px;
                color: #262c32;
                font-weight: bold;
                &::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    display: inline-block;
                    z-index: 1;
                    width: 27px;
                    border-radius: 2px;
                    border-bottom: 3px solid #00b07e;
                }
            }
            .rewardName {
                margin: 12px;
                margin-bottom: 0;
                padding: 0px 10px;
                line-height: 40px;
            }
            .count {
                position: absolute;
                top: 10px;
                right: 5px;
                background: #ff4800;
                width: 18px;
                height: 14px;
                font-style: normal;
                font-size: 11px;
                overflow: hidden;
                color: #fff;
                border-radius: 7px;
                line-height: 14px;
            }
        }
    }
    .content {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #f4f5f7;
        margin-top: 54px;
    }
}
</style>
