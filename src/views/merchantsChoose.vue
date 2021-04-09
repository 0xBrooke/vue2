/* 商户选择 */
<template>
    <div class="merchants-wrap">
        <nav-bar title="商户选择" @back="back"></nav-bar>
        <div class="merchants-choose">
            <div class="merchants">
                <div class="merchants-title">商户选择</div>
                <div
                    class="merchants-address"
                    :class="{ active: currentMerchantIndex === index }"
                    v-for="(item, index) in merchantList"
                    :key="index"
                    @click="chooseMerchant(item, index)"
                >
                    {{ item.salesName }}
                </div>
            </div>
            <div class="merchants">
                <div class="merchants-title">门店选择</div>
                <ul class="clearfix">
                    <li
                        class="merchants-name"
                        :class="{ active: currentStore === index }"
                        v-for="(item, index) in currentShopList"
                        :key="index"
                        @click="chooseStore(item, index)"
                    >
                        {{ item.deptName }}
                    </li>
                </ul>
                <div
                    class="more-stores"
                    v-if="isMoreStore"
                    @click="openMoreStore"
                >
                    展开更多门店
                </div>
            </div>
            <div class="merchants" v-if="currentStore !== ''">
                <div class="merchants-title">活动</div>
                <div class="activity-choose" @click="openPopActivity">
                    <p :class="currentActivity === '' ? '' : 'isEmpty'">
                        {{
                            currentActivity === ''
                                ? '请选择'
                                : currentActivityData.activityName
                        }}
                    </p>
                    <img
                        src="@/assets/img/applyList/jump.png"
                        @click="activity = true"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="footer">
            <button
                type="button"
                :disabled="currentStore === '' ? true : false"
                class="footer-btn"
                @click="submit"
            >
                <span>下一步</span>
            </button>
        </div>

        <!-- 底部弹框 -->
        <mt-popup class="popupWrapper" v-model="activity" position="bottom">
            <div class="pop-header">
                <div class="outside">
                    <img
                        src="@/assets/img/applyList/close.png"
                        alt="close"
                        @click="activity = false"
                    />
                </div>
                <p>活动选择</p>
                <div class="outside">
                    <div class="no-join" @click="noJoin">不参加</div>
                </div>
            </div>

            <div class="pop-content">
                <div
                    class="popup-item"
                    v-for="(item, index) in activityList"
                    :key="index"
                >
                    <div class="goods-type">
                        <img src="@/assets/img/applyList/type.png" alt="" />
                        <span>{{ item.name }}</span>
                    </div>
                    <div
                        class="goods-name"
                        v-for="(_item, _index) in item.activityApiDtoList"
                        :key="_index"
                        @click="chooseActive(index + '-' + _index, _item)"
                    >
                        <p
                            class="goods-name-text"
                            :class="{
                                isActive:
                                    currentActivity == index + '-' + _index
                            }"
                        >
                            {{ _item.activityName }}
                        </p>

                        <img
                            v-if="currentActivity == index + '-' + _index"
                            src="@/assets/img/applyList/selected.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';

export default {
    name: 'merchants',
    data() {
        return {
            isMoreStore: false, // 是否显示更多门店
            activity: false,
            selected: false,
            footerTitle: '下一步',

            member: {}, //缓存
            orderDetail: {}, //缓存订单信息
            merchantList: [], // 商户名字列表
            merchantData: '', //当前商户信息
            currentMerchantIndex: '', //当前商户下标
            shopList: [], //门店列表
            currentShopList: [], // 当前门店列表
            storeData: '', //当前选中门店信息
            currentStore: '', // 当前商店下标
            activityList: [], //活动列表数据
            currentActivity: '', // 当前活动下标
            currentName: '', //当前活动的名字
            currentActivityData: '' //当前活动数据
        };
    },
    beforeRouteLeave(to, from, next) {
        if (to.path.indexOf('goods') > -1) {
            this.$store.dispatch('setKeepAlive', ['merchants']);
        } else {
            this.$store.dispatch('setKeepAlive', []);
        }
        next();
    },
    created() {},
    destroyed() {
        MessageBox.close(false);
    },
    methods: {
        back() {
            this.$router.replace({
                name: 'ApplyList'
            });
        },
        /* ***********获取商户信息***************** */
        getMerchantList() {
            const data = {
                optNo: this.$store.state.userInfo.personNo,
                merchantType: 'MYFEN'
            };
            this.$api('/merchant/list', data).then(res => {
                if (res.resultCode === '1000') {
                    this.merchantData = res.data.merchantDTOList[0];
                    this.merchantList = res.data.merchantDTOList;
                    this.currentMerchantIndex = 0;
                    this.getShopList();
                } else {
                    Toast(res.resultMsg);
                }
            });
        },
        /* 商户选择 */
        chooseMerchant(item, index) {
            this.merchantData = item;
            this.currentMerchantIndex = index;
        },

        /* ***********获取门店信息***************** */

        /* 获取gps */
        async getPosition() {
            const pos = await YK_JSBridge.getLocation();
            return pos.data;
        },

        /*  门店选择*/
        async getShopList() {
            const pos = await this.getPosition();
            if (pos && pos.latitude !== '') {
                const data = {
                    optNo: this.$store.state.userInfo.personNo,
                    longitude: pos.longitude,
                    latitude: pos.latitude,
                    salesCode: this.merchantData.salesOrg,
                    merchantType: 'MYFEN'
                };

                this.$api('/merchant/shop/list', data).then(res => {
                    if (res.resultCode === '1000') {
                        const listArr = res.data.shopList;
                        this.shopList = listArr;
                        this.currentShopList = listArr;

                        if (this.currentShopList.length === 1) {
                            this.storeData = listArr[0];
                            this.currentStore = 0;
                            this.getActivityList();
                        }

                        if (listArr.length > 4) {
                            // 展示更多门店
                            this.currentShopList = listArr.slice(0, 4);
                            this.isMoreStore = true;
                        }
                    } else {
                        Toast(res.resultMsg);
                    }
                });
            }
        },

        /* 选择门店名字 */
        chooseStore(item, index) {
            this.storeData = item;
            this.currentStore = index;
            this.getActivityList();
        },
        /* 打开更多门店 */
        openMoreStore() {
            this.isMoreStore = false;
            this.currentShopList = this.shopList;
        },
        /* 打开底部活动弹框 */
        openPopActivity() {
            this.activity = true;
        },
        /* 获取活动列表 */
        getActivityList() {
            const data = {
                storeCode: this.storeData.deptNo,
                merchantType: '1',
                businessType: 'MYFEN',
                loanApplyNo: this.member.applyNo,
                userToken: this.member.accessToken
            };
            this.$api('/sm-api/activityList', data).then(res => {
                if (res.code === 0) {
                    this.activityList = res.data;
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 选择活动 */
        chooseActive(index, item) {
            this.currentActivity = index;
            this.currentActivityData = item;
            this.activity = false;
        },
        /*不参加活动 */
        noJoin() {
            this.currentName = '';
            this.currentActivity = '';
            this.currentActivityData = '';
            this.activity = false;
        },

        /* **************提交****************** */
        /* 获取省市 */
        async getProvince() {
            const pos = await this.getPosition();
            const data = {
                longitude: pos.longitude,
                latitude: pos.latitude
            };
            return this.$api('/sm-api/findaddress/byxyPos', data).then(res => {
                if (res.code === 0) {
                    return res.data;
                }
            });
        },
        /* 提交 */
        async submit() {
            if (!this.storeData.deptName) {
                Toast('请选择门店');
                return;
            }
            /* 获取省市 */
            const pos = await this.getProvince();
            const data = {
                loanApplyNo: this.member.applyNo,
                userToken: this.member.accessToken,
                applyProgress: '1',
                sellerType: this.merchantData.orgType, //商户type
                sellerName: this.merchantData.salesName, //商户name
                commissionerPhone: this.$store.state.userInfo.employeeMobile,
                commissionerName: this.$store.state.userInfo.employeeName,
                sellerCode: this.merchantData.salesOrg,
                storeName: this.storeData.deptName,
                storeCode: this.storeData.deptNo,
                storeDetailedAddress: this.storeData.deptAddress,
                storeLocation:
                    this.storeData.longitude + ',' + this.storeData.latitude,
                saveFlag: 'N', //@"Y" : @"N"
                discountCode: this.currentActivityData.promotionCode || '',
                discountName: this.currentActivityData.activityName || '',
                activityCode: this.currentActivityData.activityCode || '',
                storeProvinceCode: pos.provinceCode,
                storeCityCode: pos.cityCode,
                personNo: this.$store.state.userInfo.personNo
            };
            this.$api('/merchant/confirm', data).then(res => {
                if (res.resultCode === '1000') {
                    this.$store.dispatch('setIsOther', false);
                    this.$router.push({
                        name: 'Goods'
                    });
                } else {
                    Toast(res.resultMsg);
                }
            });
        },

        /* 复核信息查询 */
        getOrderDetail() {
            const data = {
                loanApplyNo: this.member.applyNo,
                token: this.member.accessToken,
                businessType: 'MYFEN'
            };

            return this.$api('/sm-api/orderDetail', data).then(res => {
                if (res.code === 0) {
                    this.orderDetail = res.data;
                } else {
                    Toast(res.showMessage);
                }
                return res.data.applyProgress;
            });
        }
    },
    mounted() {
        this.member = JSON.parse(sessionStorage.getItem('member'));
        this.getOrderDetail();
        this.getMerchantList(); //商户信息
    },
    components: {
        NavBar
    }
};
</script>

<style lang="scss" scoped>
.clearfix:after {
    display: block;
    content: ' ';
    clear: both;
    font-size: 0;
    visibility: hidden;
}
.merchants-wrap {
    background: #f3f5f7 !important;
    padding-bottom: 65px;
}
.merchants-choose {
    background: #f3f5f7;
    padding: 10px 15px;
    .merchants {
        background: #ffffff;
        border-radius: 5px;
        padding: 19px 15px 15px;
        margin-bottom: 10px;
        .merchants-title {
            margin-bottom: 16px;
            font-size: 16px;
            color: #262c32;
            height: 20px;
            line-height: 22.5px;
            position: relative;
            padding-left: 5px;
            vertical-align: top;
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
        ul {
            li {
                float: left;
            }
        }
        .merchants-address {
            width: 75px;
            height: 37px;
            border: 1px solid #dedede;
            border-radius: 4px;
            font-size: 14px;
            text-align: center;
            color: #5a6066;
            line-height: 37px;
            margin-right: 3px;
        }
        .merchants-name {
            width: 152.5px;
            height: 37px;
            margin-bottom: 10px;
            border: 1px solid #dedede;
            border-radius: 4px;
            font-size: 14px;
            text-align: center;
            color: #5a6066;
            line-height: 37px;
            &:nth-child(2n) {
                margin-left: 10px;
            }
        }
        .active {
            background: rgba(10, 156, 112, 0.05);
            border: 1px solid #0a9c70;
            color: #0a9c70;
        }
        .more-stores {
            background: #f3f5f7;
            border-radius: 4px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 11px;
            color: #919599;
            letter-spacing: 0;
        }
        .activity-choose {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin-top: 3px;
            padding-bottom: 16px;
            p {
                font-size: 16px;
                color: #b3b8bd;
                letter-spacing: 0;
                line-height: 14px;
            }
            .isEmpty {
                color: #262c32;
            }
            img {
                width: 4.7px;
                height: 9px;
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
    background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
    border-radius: 22.5px;
    &:disabled {
        opacity: 0.7;
        background-image: linear-gradient(90deg, #4dc6a4 0%, #1daf83 99%);
    }
}

/* 弹框 */
.popupWrapper {
    width: 100%;
    height: 495px;
    background-color: #f3f5f7;
    margin: 0;
    .pop-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 55px;
        background: #f9fafb;
        border-radius: 5px 5px 0 0;
        padding: 0 15px;
        .outside {
            width: 100px;
        }
        p {
            font-size: 18px;
            color: #262c32;
            letter-spacing: 0;
            text-align: center;
            line-height: 30px;
        }
        img {
            width: 15px;
            height: 15px;
            float: left;
        }
        .no-join {
            float: right;
            width: 75px;
            height: 28px;
            border: 1px solid #5a6066;
            border-radius: 14px;
            font-size: 12px;
            font-weight: bold;
            color: #5a6066;
            line-height: 28px;
            text-align: center;
        }
    }
    .pop-content {
        height: 444px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        .popup-item {
            background-color: #fff;
            margin-bottom: 10px;
            padding-top: 19px;
            .goods-type {
                height: 22.5px;
                line-height: 22.5px;
                display: flex;
                align-items: center;
                margin-left: 20px;
                img {
                    width: 12px;
                    height: 12px;
                }
                span {
                    margin-left: 5px;
                    font-size: 16px;
                    color: #262c32;
                    font-weight: 500;
                }
            }
            .goods-name {
                margin: 0 20px;
                height: 46px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .goods-name-text {
                    font-size: 14px;
                    color: #262c32;
                    letter-spacing: 0.53px;
                    line-height: 14px;
                }
                .isActive {
                    color: #0a9c70;
                }
                img {
                    margin-left: 35px;
                    width: 15.7px;
                    height: 10.6px;
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
                &:last-child.goods-name:after {
                    background: none;
                }
            }
        }
    }
}
</style>
