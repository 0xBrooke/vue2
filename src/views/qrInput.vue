/* 商户选择 --- 输入条形码 */
<template>
    <div class="qr-input">
        <nav-bar title="输入条形码" @back="back"></nav-bar>

        <div class="input-wrap">
            <img class="icon" src="@/assets/img/applyList/br-code.png" alt="" />
            <input
                class="input"
                placeholder="请输入条形码"
                @input="getQrCode"
                type="text"
                v-model="qrCode"
                style="text-transform:uppercase"
            />
            <img
                v-if="qrCode"
                @click="qrCode = ''"
                class="clear"
                src="@/assets/img/applyList/clear.png"
                alt=""
            />
        </div>

        <button
            type="button"
            :disabled="!disableSubmit"
            class="footer-btn"
            @click="getLocation"
        >
            确定
        </button>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import { isEmpty, strTrim } from '@/assets/js/utils.js';
import { YK_JSBridge } from '@/assets/js/JSBride.js';

export default {
    name: '',
    data() {
        return {
            faceing: require('@/assets/img/applyList/faceing.png'), //进行中
            faceSuccess: require('@/assets/img/applyList/faceSuccess.png'), //成功
            faceingText: '客户扫脸',
            faceSuccessText: '扫描成功',
            state: 1,
            qrCode: ''
        };
    },
    created() {},
    methods: {
        /* 校验输入框的值 */
        getQrCode() {
            this.qrCode = this.qrCode.toUpperCase();

            this.qrCode = this.qrCode.replace(/\s/g, '').replace(/[\W]/g, '');
        },
        back() {
            this.$router.replace({
                name: 'ApplyList'
            });
        },
        // 验证不能为空
        validModulesInfo() {
            if (isEmpty(strTrim(this.qrCode))) {
                return false;
            }
            return true;
        },
        /* 效验定位权限 */
        getLocation() {
            this.getHasOrder();
            /* 效验定位权限 */
            YK_JSBridge.getOnlineDeviceAuthorizationStatus(
                res => {
                    /* 未授权手动录入信息 */
                    if (res.status !== 'authorized') {
                        /* 没有权限 */
                        Toast('请在设置中开启GPS权限');
                        return;
                    }
                    this.getHasOrder();
                },
                err => {
                    console.log(err, 'err--getLocation');
                },
                'location'
            );
        },
        /* 获取gps */
        async getPosition() {
            const pos = await YK_JSBridge.getLocation();
            return pos.data;
        },
        /* 扫描二维码查询客户信息 */
        async getHasOrder() {
            let qrCode = this.qrCode.replace(/\s+/g, '');

            const pos = await this.getPosition();
            if (pos && pos.latitude !== '') {
                const data = {
                    loanApplyNo: qrCode,
                    businessType: 'MYFEN',
                    saLnt: pos.longitude,
                    saLat: pos.latitude,
                    SAName: this.$store.state.userInfo.employeeName,
                    SACode: this.$store.state.userInfo.personNo,
                    SAMobile: this.$store.state.userInfo.employeeMobile
                };
                this.$api('/sm-api/hasOrder', data).then(res => {
                    // console.log('dddd', res);
                    if (res.code === 0) {
                        /* 通知美易分扫码成功 */
                        this.getHasScanSuccess(res.data);
                        //申请人、手机号、申请编码、申请时间
                    } else {
                        Toast(res.showMsg);
                    }
                });
            }
        },
        /* 扫码成功 */
        getHasScanSuccess(item) {
            let qrCode = this.qrCode.replace(/\s+/g, '');
            if (
                item.businessType === item.productType &&
                item.applyState === '0'
            ) {
                const data = {
                    loanApplyNo: qrCode,
                    SACode: this.$store.state.userInfo.personNo,
                    SAName: this.$store.state.userInfo.employeeName,
                    SAMobile: this.$store.state.userInfo.employeeMobile,
                    applyState: '2'
                };
                this.$api('/sm-api/hasScanSuccess', data).then(res => {
                    if (res.code === 0) {
                        item.receiverName = res.data.receiverName; // 受理人
                        sessionStorage.setItem('member', JSON.stringify(item));
                        this.$router.replace({
                            name: 'CodeConfirm'
                        });
                    } else {
                        Toast(res.showMsg);
                    }
                });
            }
        }
    },
    computed: {
        disableSubmit() {
            return this.validModulesInfo();
        }
    },
    watch: {
        qrCode(newVal, oldVal) {
            console.log('输入值', newVal, oldVal);
        }
    },

    mounted() {},
    components: {
        NavBar
    }
};
</script>

<style lang="scss" scoped>
.qr-input {
    padding-top: 30px;
    background: #f3f5f7;
    width: 100%;
    .input-wrap {
        // margin-top: 30px;
        margin-left: 15px;
        padding-left: 43.5px;
        padding-right: 43.5px;
        border: 1px solid #0a9c70;
        background-color: #fff;
        border-radius: 5px;

        width: 345px;
        height: 60px;
        position: relative;
        .icon {
            position: absolute;
            top: 22.5px;
            left: 15px;
            width: 19px;
            height: 15px;
        }
        .clear {
            position: absolute;
            top: 22.5px;
            right: 15px;
            width: 15px;
            height: 15px;
        }
        .input {
            display: inline-block;
            width: 100%;
            height: 58px;
            // padding-left: 43.5px;
            // padding-right: 43.5px;
            caret-color: #0a9c70; //光标颜色
            font-size: 18px;
            color: #262c32;
            letter-spacing: 0;
            line-height: 16px;
            // background-color: #fff;
            // border: 1px solid #0a9c70;
            // border-radius: 5px;
            outline: none;
            -webkit-appearance: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    }

    /* 底部按钮 */

    .footer-btn {
        margin-top: 25px;
        margin-left: 27.5px;
        width: 320px;
        height: 45px;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        border-radius: 22.5px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        &:disabled {
            opacity: 0.7;
            background-image: linear-gradient(90deg, #4dc6a4 0%, #1daf83 99%);
        }
    }
    /* 修改input输入框的样式 */
    :-moz-placeholder {
        opacity: 1;
        line-height: 16px;
        font-size: 16px;
        color: #b3b8bd;
        letter-spacing: 0;
    }

    ::-moz-placeholder {
        line-height: 16px;
        font-size: 16px;
        color: #b3b8bd;
        letter-spacing: 0;
        opacity: 1;
    }

    input:-ms-input-placeholder {
        line-height: 16px;
        font-size: 16px;
        color: #b3b8bd;
        letter-spacing: 0;
        opacity: 1;
    }

    input::-webkit-input-placeholder {
        font-size: 16px;
        color: #b3b8bd;
        letter-spacing: 0;
        line-height: 16px;
        opacity: 1;
    }
}
</style>
