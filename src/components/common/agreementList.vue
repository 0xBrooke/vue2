<!-- 激活协议、提现协议、还款协议共用组件 -->
<template>
    <div class>
        <mt-popup class="popup-reset" v-model="popupVisible" position="bottom">
            <div class="popup-box">
                <div class="title">
                    <!-- <i
                        class="icon-dialog-close"
                        @click="popupVisible = false"
                    ></i> -->
                    <img
                        class="close-btn"
                        src="@/assets/img/bank/close.png"
                        @click="popupVisible = false"
                    />
                    <p class="agreementlist">{{ title || '协议列表' }}</p>
                </div>
                <div class="list-box" @touchmove.stop>
                    <div v-if="docType === 'contract'">
                        <div
                            class="list"
                            v-for="(item, index) in agreementListData"
                            :key="index"
                        >
                            <a
                                class="textStyle"
                                href="javascript:;"
                                @click="linkToPDF(item.contractUrl)"
                            >
                                {{ item.contractName }}
                            </a>
                        </div>
                    </div>
                    <div
                        v-else
                        class="list"
                        v-for="(item, index) in agreementListData"
                        :key="index"
                        @click="checkAgreementDetail(item)"
                    >
                        <a class="textStyle" href="javascript:;">
                            {{ item.agreementName }}
                        </a>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import { YK_JSBridge } from '@/assets/js/JSBride.js';
export default {
    name: 'AgreementList',
    data() {
        return {
            popupVisible: false
        };
    },
    watch: {
        isShowAgreementList(val) {
            this.popupVisible = val;
            if (val) {
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            } else {
                document.body.style.position = 'static';
            }
        },
        popupVisible(val) {
            if (!val) {
                // 点击 X 关闭弹窗,清除fixed
                this.$emit('getShowState', false);
                document.body.style.position = '';
                // this.$refs.listbox.scrollTop = 0;
            }
        }
    },
    props: {
        isShowAgreementList: {
            type: Boolean,
            default() {
                return false;
            }
        },
        agreementListData: {
            type: Array
        },
        agreementType: {
            type: String
        },
        capitalCode: {
            type: String
        },
        docType: {
            type: String
        },
        title: [String]
    },
    methods: {
        // 查看协议内容
        agrDetail(item) {
            this.$emit('lookOverAgrDetail', item);
        },
        // 查看协议详情
        checkAgreementDetail(item) {
            this.$emit('argDetail', item);
        },
        linkToPDF(url) {
            let device = this.$store.getters.deviceInfo.appPlatform;
            let param = `&vendor=${this.vendor}&fromSource=${this.fromSource}`;
            if (device.toLowerCase() === 'ios') {
                YK_JSBridge.openNewWebview(url + param);
            } else {
                YK_JSBridge.downLoad(url + param);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
p {
    margin: 0;
}
.popup-reset {
    width: 100%;
    border-radius: 5px 5px 0 0 !important;
    // overflow: hidden;
    .popup-box {
        background: #fff;
        border-radius: 10px 10px 0 0;
        .title {
            position: relative;
            height: 55px;
            line-height: 55px;
            text-align: center;
            font-size: 18px;
            color: #000;
            background: #f9fafb;
            border-radius: 5px 5px 0 0;
            .close-btn {
                position: absolute;
                right: 15px;
                top: 15px;
                width: 14px;
                height: 14px;
            }
        }
        .list-box {
            max-height: 306px;
            padding: 0 15px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            .list {
                height: 50px;
                line-height: 50px;
                text-align: center;
                border-bottom: 1px solid #ececec;
                color: #333;
                font-size: 16px;
                .textStyle {
                    color: #000;
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
