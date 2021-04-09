<template>
    <div class>
        <mt-popup class="popup-reset" v-model="popupVisible" position="bottom">
            <div class="popup-box">
                <div class="title">
                    <img
                        src="@/assets/img/bank/close.png"
                        @click="popupVisible = false"
                    />
                    <p>支持银行</p>
                </div>
                <div class="list-box">
                    <div
                        class="list"
                        v-for="(item, index) in supportBankListData"
                        :key="index"
                        @click="bankSelected(item)"
                    >
                        <img
                            :src="getImg(item.bankCode)"
                            alt="bank-logo"
                            class="bank-logo"
                        />
                        <span>{{ item.bankName }}</span>
                        <img
                            v-show="item.bankCode === bankCode"
                            src="@/assets/img/bank/selected.png"
                            alt="selected"
                            class="bank-selected"
                        />
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { bankLogoUrl } from '@/assets/js/utils.js';
export default {
    name: 'SuppottBankList',
    data() {
        return {
            popupVisible: false,
            supportBankList: []
        };
    },
    computed: {
        getImg() {
            return as => bankLogoUrl(as);
        }
    },
    watch: {
        showSupportBankList(val) {
            this.popupVisible = val;
        },
        supportBankListData(val) {
            this.supportBankList = val;
        },
        popupVisible(val) {
            if (!val) {
                this.$emit('resetBankListPop', false);
            }
        }
    },
    props: {
        showSupportBankList: {
            type: Boolean,
            default() {
                return false;
            }
        },
        supportBankListData: {
            type: Array
        },
        bankCode: {
            type: String,
            default: ''
        }
    },
    methods: {
        bankSelected(item) {
            this.$emit('resetBankListPop', false);
            this.$emit('bankSelected', item);
        }
    }
};
</script>
<style lang="scss" scoped>
.popup-reset {
    width: 100%;
    border-radius: 5px 5px 0 0 !important;
    overflow: hidden;
    .popup-box {
        background: #fff;
        .title {
            position: relative;
            height: 53px;
            line-height: 53px;
            text-align: center;
            font-size: 15px;
            color: #333;
            background-color: #f9fafb;
            p {
                font-size: 18px;
                color: #000000;
                text-align: center;
            }
            img {
                position: absolute;
                right: 15px;
                top: 15px;
                width: 14px;
                height: 14px;
            }
        }
        .list-box {
            box-sizing: border-box;
            padding: 0 20px;
            max-height: 420px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            .list {
                height: 62px;
                border-top: 1px solid #ebeced;
                color: #333;
                font-size: 16px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                img.bank-logo {
                    width: 24px;
                    height: 24px;
                    margin-right: 15px;
                }
                .bank-selected {
                    width: 17px;
                    height: 12px;
                    margin-left: auto;
                }
            }
            .list:first-child {
                border-top: none;
            }
            .list:last-child {
                border-bottom: none;
            }
        }
    }
}
</style>
