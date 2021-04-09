/* 复核 */
<template>
    <div>
        <nav-bar title="复核" @back="back"></nav-bar>
        <div class="review">
            <div class="review-title">
                <div class="info">分期信息</div>
                <div class="revise" @click="goBack" v-if="isModify">
                    <span>修改</span>
                    <img src="@/assets/img/applyList/jump.png" alt="" />
                </div>
            </div>
            <div class="review-wrap">
                <div class="review-item">
                    <div class="review-item-price">
                        <span class="price-type">分期金额(元)</span>
                        <span class="price-value">
                            {{ goodsDetail.periodPrice }}
                        </span>
                        <span class="price-rules">
                            具体分期金额以实际付款为准
                        </span>
                    </div>
                    <div class="review-item-detail">
                        <div class="item-detail">
                            <p>商品总价</p>
                            <span>{{ goodsDetail.goodsTotal }} 元</span>
                        </div>
                        <div class="item-detail">
                            <p>分期期数</p>
                            <span>{{ goodsDetail.loanTerm }}期</span>
                        </div>
                        <div class="item-detail">
                            <p>首付金额</p>
                            <span>
                                {{ goodsDetail.downPaymentAmount }}({{
                                    goodsDetail.downPaymentRatio
                                }}%)
                            </span>
                        </div>
                        <div class="item-detail">
                            <p>每期还款额</p>
                            <span>{{ everyPrice }}元</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="review-title">
                <div class="info">商品信息</div>
                <div class="revise" @click="goBack" v-if="isModify">
                    <span>修改</span>
                    <img src="@/assets/img/applyList/jump.png" alt="" />
                </div>
            </div>
            <div class="review-wrap">
                <div class="review-item">
                    <!-- 添加的商品 -->
                    <div class="review-goods-list">
                        <div
                            class="goods-detail"
                            v-for="(item, index) in goodsLists"
                            :key="index"
                        >
                            <div class="goods-detail-code">
                                商品：
                                <span>{{ item.goodName }}</span>
                            </div>
                            <div class="goods-detail-num">
                                <div class="detail-num-left">
                                    数量：
                                    <span>x{{ item.quantity }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <button type="button" @click="submit" class="footer-btn">
                    <span>提交进件</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';

export default {
    name: 'review',
    data() {
        return {
            activityList: false,
            isModify: false,
            stagingRate: false, //分期费率
            installmentPeriods: false, //分期期数
            otherInfor: false, //其他信息
            success: false,
            goodsLists: [],
            goodsDetail: {},
            everyPrice: '', //每期金额
            orderDetail: {}
        };
    },
    created() {},
    destroyed() {
        MessageBox.close(false);
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        /* 复核信息查询 */
        getOrderDetail() {
            const data = {
                loanApplyNo: this.member.applyNo,
                token: this.member.accessToken,
                businessType: 'MYFEN'
            };
            this.$api('/sm-api/orderDetail', data).then(res => {
                if (res.code === 0) {
                    this.orderDetail = res.data;
                    sessionStorage.setItem(
                        'orderDetail',
                        JSON.stringify(res.data)
                    );
                    let wareEntity = this.orderDetail.wareEntity;
                    let instalmentEntity = this.orderDetail.instalmentEntity;
                    this.getCalcu(wareEntity, instalmentEntity);
                    this.goodsLists = this.orderDetail.wareEntity.wareEntityDetatilList;
                    this.goodsDetail = {
                        periodPrice: (
                            wareEntity.goodsTotal -
                            instalmentEntity.downPaymentAmount
                        ).toFixed(2), //分期金额   wareEntity---》loanAmount
                        goodsTotal: wareEntity.goodsTotal, //总价    wareEntity---》 goodsTotal
                        downPaymentAmount: instalmentEntity.downPaymentAmount, //首付金额  instalmentEntity ---》downPaymentAmount
                        downPaymentRatio: instalmentEntity.downPaymentRatio, //首付比例    instalmentEntity ---》  downPaymentRatio
                        loanTerm: instalmentEntity.loanTerm //分期期数  instalmentEntity ---》  loanTerm
                    };
                } else {
                    Toast(res.showMessage);
                }
            });
        },

        // calculateInstalment/try  试算
        /* 每期还款金额 */
        getCalcu(wareEntity, instalmentEntity) {
            const data = {
                loanApplyNo: this.member.applyNo, //上个页面传进来的 applyNo
                loanCode: wareEntity.periodProductCode, // orderDetail 这个接口取得  wareEntity --->periodProductCode
                loanAmount: (
                    wareEntity.goodsTotal - instalmentEntity.downPaymentAmount
                ).toFixed(2), // orderDetail 这个接口取得  wareEntity --->goodsTotal
                term: instalmentEntity.loanTerm, //  orderDetail 这个接口取得  instalmentEntity --->loanTerm
                personalInsurance: instalmentEntity.personalInsurance, //orderDetail 这个接口取得  instalmentEntity --->personalInsurance
                eventCode: instalmentEntity.flexiblePayBag, // //orderDetail 这个接口取得 instalmentEntity --->flexiblePayBag---
                optNo: this.$store.state.userInfo.personNo, // 透传
                discountCode: this.orderDetail.sellerEntity.discountCode // 上个页面 活动  code   ---- 》 promotionCode  有就传
            };
            this.$api('/sm-api/calculateInstalment/try', data).then(res => {
                if (res.code === 0) {
                    this.everyPrice = res.data.trialAmount;
                } else {
                    Toast(res.showMsg);
                }
            });
        },

        submit() {
            // 是继续进件进来的--一种-----直接提交 ----》
            //不是进件进来的- 可修改 直接提交
            //可编辑状态 提交之前可编辑，提交之后不可编辑
            const data = {
                loanApplyNo: this.member.applyNo, //上个页面传进来的 applyNo
                userToken: this.member.accessToken, // 上个页面accessToken
                applyProgress: '4',
                SACode: this.$store.state.userInfo.personNo // 用户信息里面 personNo
            };
            this.$api('/sm-api/check/apply/confirm', data).then(res => {
                //可编辑直接成功页
                if (res.code === 0) {
                    this.$store.dispatch('setIsModify', false);
                    this.$router.push({
                        name: 'CustomerFace'
                    });
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 返回 商品分期页修改*/
        goBack() {
            /* 取消弹框 */
            MessageBox({
                title: '提示',
                message: '返回至商品信息页面后，其他信息会清空，是否确认返回',
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                confirmButtonClass: 'confirmButton',
                cancelButtonClass: 'cancelButton'
            }).then(action => {
                if (action === 'confirm') {
                    /* 确定 */
                    this.$router.push({
                        name: 'Goods'
                    });
                }
            });
        }
    },
    mounted() {
        this.isModify = this.$store.state.isModify;
        /* 重这开始 */
        this.member = JSON.parse(sessionStorage.getItem('member'));
        this.getOrderDetail();
    },
    components: {
        NavBar
    }
};
</script>

<style lang="scss">
.mint-msgbox {
    border-radius: 10px;
}
.mint-msgbox-message {
    font-size: 15px;
    color: #262c32;
    letter-spacing: 0;
    text-align: center;
}
.mint-msgbox {
    width: 71%;
}
</style>

<style lang="scss" scoped>
.clearfix:after {
    display: block;
    content: ' ';
    clear: both;
    font-size: 0;
    visibility: hidden;
}
.review {
    background: #f3f5f7 !important;
    padding-bottom: 65px;
    padding-top: 16.5px;
    height: 100%;
    overflow: auto;
    .review-title {
        margin: 0 15px 11px;
        display: flex;
        justify-content: space-between;
        .info {
            position: relative;
            padding-left: 5px;
            &:after {
                content: '';
                width: 2px;
                height: 14px;
                position: absolute;
                top: 4px;
                left: 0;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
        .revise {
            display: flex;
            align-items: center;
            span {
                margin-right: 5px;
                font-size: 13px;
                color: #0a9c70;
            }
            img {
                width: 4.7px;
                height: 9px;
            }
        }
    }
    .review-wrap {
        background: #f4f5f7;
        margin: 0 15px 20px;
        &:last-child {
            margin: 0 15px 15px;
        }
        .review-item {
            background: #fff;
            border-radius: 5px;
            padding: 0 15px;
            .review-item-price {
                height: 131.5px;
                padding: 25px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                position: relative;
                .price-type {
                    opacity: 0.8;
                    font-size: 13px;
                    color: #262c32;
                    letter-spacing: 0.26px;
                    line-height: 12px;
                }
                .price-value {
                    font-family: PingFangHK-Medium;
                    font-size: 37.5px;
                    color: #262c32;
                    letter-spacing: 0;
                    line-height: 24px;
                }
                .price-rules {
                    font-size: 13px;
                    color: #ff4800;
                    letter-spacing: 0.26px;
                    line-height: 12px;
                }
                &:after {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    content: '';
                    width: 100%;
                    height: 1px;
                    background: #dedede;
                    transform: scaleY(0.5);
                }
            }
            .review-item-detail {
                padding: 16px 0 14px;
                .item-detail {
                    height: 34px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    p {
                        font-size: 14px;
                        color: #5a6066;
                        letter-spacing: 0;
                        line-height: 14px;
                    }
                    span {
                        font-family: PingFang-SC-Bold;
                        font-size: 15px;
                        color: #333333;
                        letter-spacing: 0;
                        line-height: 14px;
                    }
                }
            }
            .review-goods-list {
                .goods-detail {
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    .goods-detail-code {
                        font-family: PingFangSC-Regular;
                        font-size: 14px;
                        color: #5a6066;
                        span {
                            line-height: 12px;
                        }
                    }
                    .goods-detail-num {
                        margin-top: 12px;
                        font-size: 12px;
                        color: #7a7f85;
                        line-height: 11px;
                    }
                    &:after {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        content: '';
                        width: 100%;
                        height: 1px;
                        background: #dedede;
                        transform: scaleY(0.5);
                    }
                    &:last-child.goods-detail:after {
                        background: none;
                    }
                }
            }
        }
    }
}
/* 底部按钮 */
.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 65px;
    padding: 10px 27.5px;
    opacity: 0.9;
    background: #fff;
}
.footer-btn {
    width: 320px;
    height: 45px;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    border-radius: 22.5px;
    background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
}
/* 取消弹框的样式 */
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
</style>
