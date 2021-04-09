<template>
    <div class="index-wrap">
        <nav-bar
            title="国美分期"
            @back="goBack"
            :searchVisible="false"
        ></nav-bar>
        <div class="bg-top">
            <div class="top">
                <div class="title">
                    <span class="icon"></span>
                    {{ getDay }}
                </div>
                <div class="small">{{ getFullYear }}</div>
            </div>
            <div class="middle" v-if="adList.length > 0">
                <mt-swipe
                    :auto="5000"
                    :defaultIndex="defaultIndex"
                    :show-indicators="true"
                    ref="swipeWrapper"
                >
                    <mt-swipe-item v-for="(item, index) in adList" :key="index">
                        <img
                            :src="item.imageUrl"
                            alt=""
                            @click="adJump(item)"
                        />
                    </mt-swipe-item>
                </mt-swipe>
            </div>
        </div>
        <!-- 活动 -->
        <div class="active" v-if="adActiveShow">
            <img
                v-for="(item, index) in adActiveList"
                :key="index"
                :src="item.imageUrl"
                @click="adJump(item)"
            />
        </div>
        <!-- content -->
        <div class="main">
            <div class="item item-1" @click="goPage('ApplyList')">
                <h2>
                    <span></span>
                    进件中
                </h2>
                <h1>{{ orderNumber }}</h1>
                <p>我要办单</p>
            </div>
            <div class="item item-2" @click="goPage('QrCode')">
                <p>我的二维码</p>
            </div>
            <div class="item item-3" @click="goPage('Promoter')">
                <p>推广员奖励</p>
            </div>
        </div>
        <!-- 客户管理 -->
        <div class="customer" @click="goPage('CustomerList')">
            <img class="c-img" src="@/assets/img/index/customer.png" />
            <span>客户管理</span>
            <img class="right-img" src="@/assets/img/index/right.png" />
        </div>
        <div class="customer" @click="goPage('GoldActivityPage')">
            <img class="c-img" src="@/assets/img/index/active.png" />
            <span>活动登记</span>
            <img class="right-img" src="@/assets/img/index/right.png" />
        </div>
    </div>
</template>

<script>
import { YK_JSBridge } from '../assets/js/JSBride.js';
import moment from 'moment';
import navBar from '@/components/common/navBar.vue';

export default {
    name: 'Index',
    data() {
        return {
            defaultIndex: 0,
            adList: [],
            orderNumber: '',
            JumpType: '', // 跳转页面类型（1跳转身份证上传2绑卡页面3扫脸登录）
            personNo: this.$store.state.userInfo.personNo,
            adActiveList: [],
            adActiveShow: false
        };
    },
    computed: {
        getDay() {
            moment.locale('zh-cn');
            return moment().format('dddd');
        },
        getFullYear() {
            return moment().format('YYYY.MM.DD');
        },
        saCode() {
            return this.$store.state.userInfo.personNo;
        }
    },
    created() {
        this.getAdvertisement();
        this.getAdActive();
        this.fetchApplyingCount();
    },
    methods: {
        goPage(page) {
            // 客户管理页
            // 二维码页
            // 进件列表
            // 推广员
            if (page === 'ApplyList' || page === 'QrCode') {
                // 校验是否有权限
                this.checkSaPermissions(page);
            } else {
                this.$router.push({
                    name: page
                });
            }
        },
        /* 调广告位接口，获取广告位信息 */
        getAdvertisement() {
            let adID =
                process.env.NODE_ENV === 'production' ? '24664' : '51869';
            const params = {
                token: this.$store.state.token,
                businessLine: '0907',
                adIds: adID, // 51869、24664
                traceNo: 'xiaomeibangke'
            };
            this.$api('/sm-api/advertisement/queryAdvertisement', params).then(
                res => {
                    if (res.code === 0) {
                        const adData = res.data.map(item => JSON.parse(item));
                        this.adList = adData.length ? adData[0].launchList : [];
                    } else {
                        Toast(res.showMsg);
                    }
                }
            );
        },
        /* SA查询所有办单权限 */
        checkSaPermissions(typeName) {
            this.$api('/user/authority', {
                optNo: this.personNo, // 员工编码
                businessType: 'MYFEN' // 业务类型
            }).then(res => {
                if (res.resultCode === '1000') {
                    if (res.data.MYFEN) {
                        this.$router.push({
                            name: typeName
                        });
                    } else {
                        Toast('暂无办单权限，请联系运营人员开通');
                    }
                } else {
                    Toast(res.resultMsg);
                }
            });
        },

        /* 查询SA首页所有进件中的数量 */
        fetchApplyingCount() {
            this.$api('/fen/applyingCount', {
                SACode: this.saCode,
                businessType: 'MYFEN',
                params4ApplyingList: 'MYFEN',
                optRoles: 1 // 1.业务员 2.录单员 3.推广员
            })
                .then(res => {
                    if (res.resultCode === '1000') {
                        this.orderNumber = res.data.MYFEN;
                    } else {
                        Toast(res.resultMsg);
                    }
                })
                .catch(err => {
                    console.log(err, 'err');
                });
        },
        /* 关闭H5页面，返回帮客App */
        goBack() {
            YK_JSBridge.closePage();
        },
        // 广告位跳转web链接
        adJump(item) {
            const url = item.url;
            YK_JSBridge.openNewWebview(url);
        },
        // 活动广告位
        getAdActive() {
            let adActiveID =
                process.env.NODE_ENV === 'production'
                    ? '25487,25489'
                    : '53234,53236';
            const params = {
                token: this.$store.state.token,
                businessLine: '0907',
                adIds: adActiveID,
                traceNo: 'xiaomeibangke'
            };
            this.$api('/sm-api/advertisement/queryAdvertisement', params).then(
                res => {
                    if (res.code === 0) {
                        const adActive = res.data.map(item => JSON.parse(item));
                        if (adActive.length === 2) {
                            this.adActiveShow = true;
                            this.adActiveList = adActive.map(
                                item => item.launchList[0]
                            );
                        } else {
                            this.adActiveShow = false;
                        }
                    } else {
                        Toast(res.showMsg);
                    }
                }
            );
        }
    },
    components: {
        navBar
    }
};
</script>

<style lang="scss" scoped>
.index-wrap {
    .bg-top {
        width: 100%;
        background-image: url('../assets/img/index/top.png');
        background-size: 100% 100%;
    }
    .top {
        padding: 25px 17.5px 18px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        .title {
            padding-left: 26px;
            margin-right: 8px;
            position: relative;
            font-size: 23px;
            color: #262c32;
            font-weight: bold;
            .icon {
                position: absolute;
                top: 6.5px;
                left: 0;
                width: 18px;
                height: 19.5px;
                background-size: cover;
                background-image: url('../assets/img/index/calendar.png');
                background-position: center top;
                background-repeat: no-repeat;
            }
        }
        .small {
            font-size: 17px;
            color: #7a7f84;
            margin-top: 2px;
        }
    }
    .middle {
        width: 340px;
        height: 120px;
        border-radius: 8px;
        position: relative;
        box-shadow: 0 3px 8px 0px #c2c7cb;
        margin: 0 auto 15px auto;
        img {
            height: 100%;
            border-radius: 8px;
        }
    }
    .active {
        display: flex;
        justify-content: space-between;
        // height: 75px;
        padding: 0 18px;
        margin-bottom: 15px;
        img {
            width: 49%;
        }
    }
    .main {
        display: flex;
        flex-direction: row;
        justify-items: center;
        align-items: center;
        padding-left: 17.5px;
        .item {
            width: 108px;
            height: 132px;
            background-size: cover;
            background-position: center top;
            background-repeat: no-repeat;
            margin-right: 8px;
            position: relative;
            font-weight: bold;
            &.item-1 {
                background-image: url('../assets/img/index/list.png');
            }
            &.item-2 {
                background-image: url('../assets/img/index/qr.png');
            }
            &.item-3 {
                background-image: url('../assets/img/index/promoter.png');
            }
            h2 {
                opacity: 0.9;
                font-size: 11px;
                color: #296ff9;
                line-height: 32px;
                padding-left: 45px;
                font-weight: 500;
                margin-bottom: 4px;
                span {
                    position: absolute;
                    top: 8px;
                    left: 30px;
                    width: 11px;
                    height: 13px;
                    background-image: url('../assets/img/index/do.png');
                    background-size: cover;
                    background-position: center top;
                    background-repeat: no-repeat;
                }
            }
            h1 {
                font-size: 30px;
                color: #ffffff;
                text-align: center;
            }
            p {
                position: absolute;
                bottom: 25.5px;
                width: 100%;
                text-align: center;
                font-size: 14px;
                color: #ffffff;
            }
        }
    }
}
/deep/.mint-swipe {
    width: 340px;
    height: 120px;
    .mint-swipe-indicators {
        bottom: 5px;
    }
    .mint-swipe-indicator {
        width: 8px;
        height: 3px;
        background: rgba(255, 255, 255, 0.6);
        opacity: 1;
        border-radius: 4px;
        &.is-active {
            width: 15px;
            background: rgba(255, 255, 255, 1);
        }
    }
}
// 客户管理
.customer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 8px 17.5px;
    padding: 16px 12px 22px 12px;
    background-image: url('../assets/img/index/admin-bg.png');
    background-size: 100% 100%;
    border-radius: 7px;
    font-size: 15px;
    color: #262c32;
    .c-img {
        width: 39px;
        height: 39px;
        margin-right: 12px;
    }
    .right-img {
        width: 11px;
        height: 15px;
        margin-left: auto;
        margin-right: 12px;
    }
}
</style>
