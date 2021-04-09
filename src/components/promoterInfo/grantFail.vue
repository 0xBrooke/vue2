<template>
    <div>
        <div :style="{ height: distance + 'px' }" class="pull_refresh">
            <p v-if="pullStatus !== 2">
                {{ pullTexts[pullStatus] }}
            </p>
            <p class="pull_refresh" v-else>
                <span>{{ pullTexts[pullStatus] }}</span>
            </p>
        </div>
        <div
            class="grantFail"
            ref="grantFail"
            @touchstart="touchStart"
            @touchend="touchEnd"
            @touchmove="touchMove"
        >
            <div
                class="grantFail-content"
                v-for="(item, index) in rewardList"
                :key="index"
            >
                <div class="title-top">
                    <div class="title-top-name">
                        <span>客户 {{ item.cName }}</span>
                    </div>
                    <span class="tel">
                        {{ item.cPhone }}
                    </span>
                </div>
                <div class="grantFail-info" @click="again(index)">
                    <div class="grantFail-title">
                        <span>{{ item.commodityName }}</span>
                        <span class="data">
                            {{ item.contarctsignTime | getTime }}
                        </span>
                    </div>
                    <p>
                        <span class="grantFail-info-title">订单号：</span>
                        <span>{{ item.orderId }}</span>
                    </p>
                    <p>
                        <span class="grantFail-info-title">贷款金额:</span>
                        <span>{{ item.commodityLoanAmt }}元</span>
                    </p>
                    <div class="grantBtn">
                        <span>重新发放</span>
                    </div>
                </div>
            </div>
            <div class="none" v-if="rewardList.length === 0">
                <span>暂无数据</span>
            </div>
            <div class="load-more" v-if="hasMore">
                <span>加载中…</span>
            </div>
            <div class="load-more" v-if="loaded">
                <span>已经到底了~</span>
            </div>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { changeTime } from '@/assets/js/utils.js';
export default {
    props: {
        getStatus: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            rewardList: [],
            curPagerNo: 1,
            pageSize: 10,
            loaded: false, // 当前页是否请求完成
            hasMore: false, // 是否还有数据
            startPosition: 0, // 触摸开始位置
            endPosition: 0, // 触摸结束位置
            distance: 0, // 下拉距离
            pullStatus: 0, // 0下拉即可刷新  1松手即可刷新  2加载中 3加载完毕
            pullTexts: ['下拉即可刷新哦~', '松手刷新~', '加载中...', '加载完毕']
        };
    },
    mounted() {
        this.$refs.grantFail.addEventListener(
            'scroll',
            debounce(this.scrollListener, 500)
        );
    },
    methods: {
        scrollListener() {
            const list = this.$refs.grantFail;
            if (
                list.scrollHeight - list.scrollTop - list.offsetHeight < 10 &&
                this.hasMore
            ) {
                this.curPagerNo++;
                this.getRewardList();
            }
        },
        touchStart(e) {
            this.startPosition = e.touches[0].pageY;
        },
        touchMove(e) {
            const scrollTop = this.$refs.grantFail.scrollTop;
            if (scrollTop < 1) {
                let distance = e.touches[0].pageY - this.startPosition;
                if (distance > 0) {
                    e.preventDefault();
                    if (distance > 70) {
                        if (distance !== 70) {
                            this.pullStatus = 1;
                            this.distance = 70;
                        }
                    } else {
                        this.pullStatus = 0;
                        this.distance = distance;
                    }
                }
            }
        },
        touchEnd() {
            const scrollTop = this.$refs.grantFail.scrollTop;
            if (scrollTop <= 1 && this.distance >= 70) {
                this.pullStatus = 2;
                setTimeout(() => {
                    this.distance = 0;
                    this.pullStatus = 3;
                    this.rewardList = [];
                    this.curPagerNo = 1;
                    this.getRewardList();
                    if (this.getStatus) {
                        this.getStatus();
                    }
                }, 500);
            }
        },
        again(index) {
            let info = {
                orderId: this.rewardList[index].orderId,
                goodId: this.rewardList[index].goodId,
                goodUnique: this.rewardList[index].serialNumber
            };
            this.$router.push({
                name: 'GrantList',
                query: info
            });
        },
        //获取已发放列表
        getRewardList() {
            this.loaded = false;
            this.hasMore = false;
            const data = {
                saCode: this.$store.state.userInfo.personNo,
                sendStatus: '2', //待发放：3；失败：2；发放中：1；已发放：0；
                curPagerNo: this.curPagerNo, // 当前页数
                pageSize: this.pageSize // 每页条数
            };
            this.$api('/sm-api/rewardList/query', data).then(res => {
                if (res.code === 0) {
                    this.rewardList.push(...res.data.list);
                    this.hasMore = res.data.rowsCount > this.curPagerNo;
                    if (res.data.rowsCount === this.curPagerNo) {
                        this.loaded = true;
                        this.hasMore = false;
                    }
                } else {
                    Toast(res.showMsg);
                }
            });
        }
    },
    filters: {
        getTime(time) {
            return changeTime(time);
        }
    }
};
</script>

<style lang="scss" scoped>
.grantFail {
    padding: 0px 15px;
    padding-bottom: 100px;
    height: 100%;
    width: 100%;
    background: #f4f5f7;
    position: fixed;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
    .grantFail-content {
        width: 345px;
        height: 170px;
        background: #fff;
        border-radius: 5px;
        position: relative;
        .title-top {
            height: 44px;
            margin: 10px 15px 0 15px;
            border-bottom: 1px solid #dedede;
            display: flex;
            justify-content: space-between;
            .title-top-name {
                display: inline-block;
                line-height: 44px;
                span {
                    font-size: 14px;
                    color: #5a6066;
                    padding-right: 5px;
                }
            }
            .tel {
                font-size: 14px;
                color: #5a6066;
                line-height: 44px;
            }
        }
        .grantFail-info {
            padding: 0px 15px;
            .grantFail-title {
                display: flex;
                padding: 12px 0 8px 0;
                line-height: 18px;
                width: 100%;
                span {
                    width: 80%;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 550;
                    color: #262c32;
                }
                .data {
                    width: 27%;
                    font-size: 14px;
                    display: inline-block;
                    color: #5a6066;
                    font-weight: 400;
                    height: 20px;
                    text-align: right;
                }
            }
            p {
                color: #7a7f85;
                font-size: 12px;
                line-height: 20px;
                .grantFail-info-title {
                    display: inline-block;
                    width: 60px;
                }
                span {
                    color: #7a7f85;
                    font-size: 12px;
                    line-height: 20px;
                }
            }
            .grantBtn {
                width: 75px;
                height: 28px;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
                border-radius: 14px;
                text-align: center;
                line-height: 28px;
                position: absolute;
                bottom: 14px;
                right: 11px;
                span {
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
    }
}
.load-more {
    width: 100%;
    height: 50px;
    background: #f3f5f7;
    color: #999999;
    font-size: 12px;
    text-align: center;
    line-height: 50px;
}
.none {
    width: 200px;
    height: 115px;
    background: url('../../assets/img/customer/noneCustomer.png') no-repeat;
    background-size: 200px 115px;
    margin: 172px 88px 25px 78px;
    position: relative;
    span {
        font-size: 16px;
        color: #5a6066;
        font-family: PingFangSC-Regular;
        font-weight: 500;
        position: absolute;
        top: 120px;
        left: 66px;
    }
}
.pull_refresh {
    width: 100%;
    background: #f3f5f7;
    color: #999999;
    font-size: 12px;
    text-align: center;
    line-height: 50px;
}
</style>
