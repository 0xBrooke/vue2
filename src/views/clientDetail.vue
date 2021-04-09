<template>
    <div>
        <nav-bar title="客户信息" @back="back"></nav-bar>
        <div class="container">
            <div class="clientInfo">
                <div class="top_title">
                    <span class="title">客户信息</span>
                </div>
                <div class="name_tel" v-if="lists">
                    <span class="name">{{ lists[0].name }}</span>
                    <span class="phone">
                        {{ lists[0].cellphone | changePhone }}
                    </span>
                </div>
            </div>
            <!-- 订单详情 -->
            <div class="goods_info" v-if="lists">
                <div class="top_title">
                    <span class="title">订单信息</span>
                </div>
                <div class="goods_cont clearfix">
                    <p>
                        <span class="goods_cont_left">申请编号</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].orderId }}
                        </span>
                    </p>
                    <p>
                        <span class="goods_cont_left">订单时间</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].orderCreateTimeString }}
                        </span>
                    </p>
                    <p>
                        <span class="goods_cont_left">首付比例</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].downPaymentRatio }}%
                        </span>
                    </p>
                    <p>
                        <span class="goods_cont_left">首付金额</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].downPaymentAmount }}
                        </span>
                    </p>
                    <p>
                        <span class="goods_cont_left">商品总金额</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].goodsTotal }}
                        </span>
                    </p>
                    <p v-if="lists[0].orderStatusTwoLevelCode > 20">
                        <span class="goods_cont_left">综合费率</span>
                        <span class="goods_cont_right_med">
                            {{ lists[0].generalRate }}%
                        </span>
                    </p>
                    <div class="price">
                        <span>共{{ lists[0].totalQuantity }}件商品</span>
                        <span>合计贷款:</span>
                        <strong>￥{{ lists[0].totalStageAmout }}</strong>
                    </div>
                </div>
            </div>
            <!-- 商品信息 -->
            <div class="goods_info">
                <div class="top_title">
                    <span class="title">商品信息</span>
                </div>
                <div
                    class="goods_info_cont"
                    v-for="(item, index) in lists"
                    :key="index"
                >
                    <div class="goods_cont clearfix">
                        <p>
                            <span class="goods_name">
                                {{ item.commodityName }}
                            </span>
                            <span class="goods_cont_right_blod">
                                X{{ item.quantity }}
                            </span>
                        </p>
                        <p>
                            <span class="goods_cont_left">
                                商品编码:
                                <span>{{ item.commodityId | clearZero }}</span>
                            </span>
                        </p>
                        <p>
                            <span class="goods_cont_left">商品单价</span>
                            <span class="goods_cont_right">
                                {{ item.price }}
                            </span>
                        </p>
                        <p>
                            <span class="goods_cont_left">建议首付金额</span>
                            <span class="goods_cont_right">
                                {{ item.goodsDownPaymentAmount }}
                            </span>
                        </p>
                        <p>
                            <span class="goods_cont_left">付款状态</span>
                            <span
                                class="goods_cont_right"
                                v-if="item.unPaidCount > 0"
                            >
                                {{ item.unPaidCount }}件未付款
                            </span>
                            <span class="goods_cont_right" v-else>已付款</span>
                        </p>
                        <div class="list_bot">
                            <span>
                                {{ item.orderStatusTwoLevelDesc }}
                            </span>
                            <span>分 {{ item.appLoanTerm }} 期</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import { idNoFormat } from '@/assets/js/utils.js';
export default {
    components: {
        NavBar
    },
    data() {
        return {
            lists: ''
        };
    },
    created() {
        this.getDataList();
    },
    methods: {
        //返回首页
        back() {
            this.$router.go(-1);
        },
        // 请求订单列表
        getDataList() {
            const data = {
                appNo: this.$route.query.appNo,
                productCode: '1',
                curPagerNo: '1',
                pageSize: '10000'
            };
            this.$api('/sm-api/customOrderDetail', data).then(res => {
                if (res.code === 0) {
                    this.lists = res.data;
                } else {
                    Toast(res.showMsg);
                }
            });
        }
    },
    filters: {
        changePhone(tel) {
            return idNoFormat(tel);
        },
        clearZero(val) {
            // 将产品编码前面的0清除
            return val && val.replace(/\b(0+)/gi, '');
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding-top: 10px;
    height: 100%;
    width: 100%;
    overflow: auto;
    padding-bottom: 80px;
    position: fixed;
    background: #f4f5f7;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
}
.clearfix:after {
    display: block;
    content: ' ';
    clear: both;
    font-size: 0;
    visibility: hidden;
}
.clientInfo {
    margin: 0px 15px 10px 15px;
    background-color: #fff;
    padding: 20px 0px 0px 15px;
    border-radius: 5px;
    .top_title {
        position: relative;
        .title {
            padding-left: 5px;
            font-size: 16px;
            color: #262c32;
            font-family: PingFangHK-Regular;
            line-height: 14px;
            &:before {
                content: '';
                width: 2px;
                height: 14px;
                position: absolute;
                top: 4px;
                left: 0px;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
    }
    .name_tel {
        padding: 15px 0px 20px 6px;
        .name {
            font-family: PingFangHK-Regular;
            line-height: 14px;
            font-size: 16px;
            font-weight: 550;
        }
        .phone {
            font-family: PingFangHK-Regular;
            line-height: 14px;
            font-size: 16px;
            font-weight: 550;
            padding-left: 10px;
        }
    }
}

.goods_info {
    margin: 10px 15px;
    background-color: #fff;
    padding: 20px 0px 0px 15px;
    border-radius: 5px;
    .top_title {
        position: relative;
        .title {
            padding-left: 5px;
            font-size: 16px;
            color: #262c32;
            font-family: PingFangHK-Regular;
            line-height: 14px;
            &:before {
                content: '';
                width: 2px;
                height: 14px;
                position: absolute;
                top: 4px;
                left: 0px;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
    }
    .goods_cont {
        padding: 20px 0px 10px 6px;
        margin-right: 15px;
        border-bottom: solid 1px #ebeced;
        p {
            padding-bottom: 10px;
            .goods_cont_left {
                font-family: PingFangSC-Regular;
                font-size: 13px;
                color: #7a7f85;
            }
            .goods_cont_right_med {
                font-family: PingFang-SC-Bold;
                font-size: 13px;
                color: #262c32;
                float: right;
                font-weight: 500;
            }
            .goods_cont_right_blod {
                font-family: PingFang-SC-Bold;
                font-size: 13px;
                color: #262c32;
                float: right;
                font-weight: 600;
            }
            .goods_cont_right {
                font-family: PingFang-SC-Bold;
                font-size: 13px;
                color: #7a7f85;
                float: right;
            }
        }
        .price {
            margin-top: 5px;
            padding-top: 5px;
            border-top: solid 1px #ebeced;
            text-align: right;
            line-height: 43.5px;
            span {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #7a7f85;
                padding-right: 4px;
            }
            strong {
                font-family: PingFangSC-Semibold;
                font-size: 18px;
                color: #262c32;
            }
        }
    }
}
.goods_name {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #262c32;
    font-weight: 600;
    display: inline-block;
    width: 90%;
}
.list_bot {
    float: right;
    border-radius: 4px;
    span {
        background: rgba(255, 72, 0, 0.1);
        border-radius: 4px;
        border-radius: 4px;
        display: inline-block;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        color: #ff4800;
        margin-left: 10px;
    }
}
</style>
