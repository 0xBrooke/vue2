<template>
    <div class="main">
        <nav-bar title="客户信息" @back="back"></nav-bar>
        <div v-for="(item, i) in list" :key="i" class="consumerInfo">
            <div class="clientInfo">
                <div class="top_title">
                    <span class="title">客户信息</span>
                </div>
                <div class="name_tel">
                    <span class="name">{{ item.name }}</span>
                    <span class="phone">
                        {{ item.cellphone | changePhone }}
                    </span>
                </div>
            </div>
            <div class="orderList">
                <div class="top_title">
                    <span class="title">订单信息</span>
                </div>
                <div class="list">
                    <div
                        v-for="(item, i) in item.orderForSas"
                        :key="i"
                        @click="goInfo(item)"
                    >
                        <div
                            :class="
                                item.productId === '6601'
                                    ? 'list-title-M'
                                    : item.productId === '6666'
                                    ? 'list-title-m'
                                    : 'list-title-T'
                            "
                        >
                            <span class="icon"></span>
                            <span class="title">{{ item.productName }}</span>
                            <span class="list_bot">
                                {{ item.orderStatusTwoLevelDesc }}
                            </span>
                        </div>
                        <div class="list-cont">
                            <p>
                                订单编号:
                                <span>{{ item.appNo }}</span>
                            </p>
                            <p>
                                订单时间:
                                <span>{{ item.compTimeString }}</span>
                            </p>
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
            list: '',
            appNo: ''
        };
    },
    created() {
        this.getOrderList();
    },
    methods: {
        //返回首页
        back() {
            this.$router.go(-1);
        },
        //请求订单列表
        getOrderList() {
            const data = {
                saCode: this.$store.state.userInfo.personNo,
                curPagerNo: '1',
                pageSize: '100000',
                userId: this.$route.query.userId
            };
            this.$api('/sm-api/orderList', data).then(res => {
                if (res.code === 0) {
                    this.list = res.data;
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        //跳转订单详情页面
        goInfo(item) {
            this.appNo = item.appNo;
            this.$router.push(`/clientDetail?appNo=${this.appNo}`);
        }
    },
    filters: {
        changePhone(tel) {
            return idNoFormat(tel);
        }
    }
};
</script>

<style lang="scss" scoped>
.consumerInfo {
    padding-top: 10px;
    height: 100%;
    width: 100%;
    overflow: auto;
    padding-bottom: 60px;
    position: fixed;
    background: #f4f5f7;
    -webkit-touch-callout: text;
    -webkit-user-select: text;
    user-select: text;
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

    .orderList {
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
        .list {
            // 国美分期-M
            .list-title-m {
                .icon {
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    margin: 20px 0px 5px 0px;
                    background: url('../assets/img/customer/gome-m.png')
                        no-repeat center;
                    background-size: 23px 23px;
                }
                .title {
                    position: relative;
                    bottom: 10px;
                    margin: 20px 0px 0px 7px;
                    font-family: PingFangHK-Medium;
                    font-size: 16px;
                    color: #262c32;
                    font-weight: 550;
                }
                .list_bot {
                    font-size: 13px;
                    color: #ff4800;
                    margin: 20px 15px 0 0;
                    float: right;
                    font-weight: 550;
                }
            }
            //国美分期
            .list-title-M {
                .icon {
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    margin: 20px 0px 5px 0px;
                    background: url('../assets/img/customer/store.png')
                        no-repeat center;
                    background-size: 23px 23px;
                }
                .title {
                    position: relative;
                    bottom: 10px;
                    margin: 20px 0px 0px 7px;
                    font-family: PingFangHK-Medium;
                    font-size: 16px;
                    color: #262c32;
                    font-weight: 550;
                }
                .list_bot {
                    font-size: 13px;
                    color: #ff4800;
                    margin: 20px 15px 0 0;
                    float: right;
                    font-weight: 550;
                }
            }
            //国美分期线上
            .list-title-T {
                .icon {
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    margin: 20px 0px 5px 0px;
                    background: url('../assets/img/customer/gome.png') no-repeat
                        center;
                    background-size: 23px 23px;
                }
                .title {
                    position: relative;
                    bottom: 10px;
                    margin: 20px 0px 0px 7px;
                    font-family: PingFangHK-Medium;
                    font-size: 16px;
                    color: #262c32;
                    font-weight: 550;
                }
                .list_bot {
                    font-size: 13px;
                    color: #ff4800;
                    margin: 20px 15px 0 0;
                    float: right;
                    font-weight: 550;
                }
            }
            .list-cont {
                margin-right: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #dedede;
                p {
                    font-family: PingFangSC-Regular;
                    font-size: 13px;
                    color: #5a6066;
                    line-height: 26px;
                }
            }
        }
    }
}
.list > div:last-child > .list-cont {
    border: none !important;
}
</style>
