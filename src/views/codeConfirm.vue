/* 二维码/条形码 */
<template>
    <div class="code-confirm">
        <nav-bar title="二维码/条形码" @back="back"></nav-bar>
        <!-- 底部弹框 -->
        <mt-popup
            class="popupWrapper"
            v-model="popupVisible"
            position="bottom"
            closeOnClickModal
        >
            <div class="dialog-header">
                <span></span>
                <p>信息确认</p>
                <img
                    src="@/assets/img/applyList/close.png"
                    alt="close"
                    @click="goApplyList"
                />
            </div>
            <div class="info-confirm">
                <div class="confirm-item">
                    <div class="item-type">申请人</div>
                    <div class="item-value value-color">
                        {{ info.userName }}
                    </div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">手机号码</div>
                    <div class="item-value value-color" v-if="info.mobile">
                        {{ phoneFilter(info.mobile) }}
                    </div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">申请编码</div>
                    <div class="item-value">{{ info.applyNo }}</div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">申请时间</div>
                    <div class="item-value">{{ info.createdAt }}</div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">受理人</div>
                    <div class="item-value">{{ info.receiverName }}</div>
                </div>
            </div>
            <button class="info-btn" @click="goMerchants" type="button">
                确认并继续
            </button>
        </mt-popup>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import { strFilter } from '@/assets/js/utils.js';

export default {
    name: '',
    data() {
        return {
            popupVisible: true,
            info: {}
        };
    },
    created() {},
    methods: {
        phoneFilter(val) {
            return strFilter(val);
        },
        back() {
            this.popupVisible = false;
            this.$router.replace({
                name: 'ApplyList'
            });
        },
        goMerchants() {
            this.popupVisible = false;
            this.$router.replace({
                name: 'MerchantsChoose'
            });
        },
        goApplyList() {
            this.popupVisible = false;
            this.$router.replace({
                name: 'ApplyList'
            });
        }
    },
    mounted() {
        this.info = JSON.parse(sessionStorage.getItem('member'));
    },
    components: {
        NavBar
    }
};
</script>

<style lang="scss" scoped>
.code-confirm {
    background: #f3f5f7;
    /* 弹框 */
    .popupWrapper {
        width: 100%;
        height: 400px;
        background-color: #fff;
        margin: 0;
        .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 55px;
            background: #f9fafb;
            border-radius: 5px 5px 0 0;
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
                margin: 0 14.5px;
            }
            span {
                width: 15px;
                height: 15px;
                margin: 0 14.5px;
            }
        }
        .info-confirm {
            margin: 19px 0 0;
            .confirm-item {
                margin-left: 25px;
                height: 47px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .item-type {
                    width: 60px;
                    font-size: 15px;
                    color: #333333;
                    letter-spacing: 0;
                }
                .item-value {
                    margin-left: 35px;
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                    text-align: right;
                    line-height: 15px;
                }
                .value-color {
                    color: #ff4800;
                }
            }
        }
        .info-btn {
            background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
            border-radius: 45px;
            border-radius: 45px;
            width: 320px;
            height: 45px;
            font-size: 16px;
            line-height: 45px;
            color: #fff;
            text-align: center;
            margin-top: 24.5px;
            margin-left: 27.5px;
        }
    }
}
</style>
