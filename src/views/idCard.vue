<template>
    <div class="section">
        <nav-bar title="上传身份证照片" @back="goBack"></nav-bar>
        <div class="info-box">
            <h1>拍摄身份证正反面</h1>
            <div class="card-main">
                <div
                    v-if="!defaultFront"
                    class="card-front"
                    @click="uploadCardHandle('defaultFront')"
                >
                    <p>
                        拍摄身份证
                        <i>人像面</i>
                    </p>
                </div>
                <div
                    class="card-img-front"
                    v-else
                    @click="uploadCardHandle('defaultFront')"
                >
                    <i class="i-phone"></i>
                    <img :src="'data:image/jpg;base64,' + defaultFront" />
                </div>
                <div
                    v-if="!defaultBack"
                    class="card-back"
                    @click="uploadCardHandle('defaultBack')"
                >
                    <p>
                        拍摄身份证
                        <i>国徽面</i>
                    </p>
                </div>
                <div
                    class="card-img-back"
                    v-else
                    @click="uploadCardHandle('defaultBack')"
                >
                    <i class="i-phone"></i>
                    <img :src="'data:image/jpg;base64,' + defaultBack" />
                </div>
            </div>
        </div>
        <!-- 身份证信息展示start -->
        <div class="info-content" v-if="defaultFront">
            <div class="card-text">请核对自动识别结果，如有误请手动修改</div>
            <div class="item selected-box">
                <div class="title">姓名</div>
                <p class="label bottom input-w">
                    <input
                        type="text"
                        name="customerInfoName"
                        maxlength="15"
                        placeholder="请输入姓名"
                        v-model="customerInfoName"
                        @paste="limitNameInput"
                        @keyup="limitNameInput"
                        @input="limitNameInput"
                    />
                    <span
                        class="i-close"
                        v-if="customerInfoName"
                        @click="closeHandler('customerInfoName')"
                    ></span>
                </p>
            </div>
            <div class="item selected-box">
                <div class="title">身份证号</div>
                <p class="label bottom input-w">
                    <input
                        type="text"
                        maxlength="18"
                        placeholder="请输入身份证号"
                        name="customerInfoIdNo"
                        v-model="customerInfoIdNo"
                        @paste="limitCardInput"
                        @keyup="limitCardInput"
                        @input="limitCardInput"
                    />
                    <span
                        class="i-close"
                        v-if="customerInfoIdNo"
                        @click="closeHandler('customerInfoIdNo')"
                    ></span>
                </p>
            </div>
            <div class="item selected-box">
                <div class="title">住址</div>
                <p class="label input-w">
                    <textarea
                        type="text"
                        maxlength="120"
                        placeholder="请输入住址"
                        name="customerInfoAdress"
                        v-model="customerInfoAdress"
                    />
                    <span
                        class="i-close"
                        v-if="customerInfoAdress"
                        @click="closeHandler('customerInfoAdress')"
                    ></span>
                </p>
            </div>
        </div>
        <!-- 身份证信息展示end -->
        <button
            v-show="footerShow"
            :disabled="!disableSubmit"
            type="button"
            class="btn"
            @click="saveInfo()"
        >
            下一步
        </button>
    </div>
</template>

<script>
import { isEmpty, strTrim, idCardHead } from '@/assets/js/utils.js';
import NavBar from '@/components/common/navBar.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';
import userCheck from '@/assets/js/userCheck.js';
export default {
    name: 'IdCard',
    mixins: [userCheck],
    data() {
        return {
            defaultFront: '',
            defaultBack: '',
            customerInfoName: '', // 身份证姓名
            customerInfoIdNo: '', // 身份证号码
            customerInfoAdress: '', // 地址
            cardValidity: '', //有效期开始
            cardExpiryDate: '', //有效期结束
            // 软键盘问题
            footerShow: true,
            screenHeight: document.documentElement.clientHeight, //此处也可能是其他获取方法
            originHeight: document.documentElement.clientHeight
        };
    },
    computed: {
        disableSubmit() {
            return this.validModulesInfo();
        }
    },
    mounted() {
        // 监听窗户变化
        window.onresize = () => {
            return (() => {
                this.screenHeight = document.documentElement.clientHeight;
            })();
        };
    },
    watch: {
        screenHeight(val) {
            if (this.originHeight > val + 100) {
                //加100为了兼容华为的返回键
                this.footerShow = false;
            } else {
                this.footerShow = true;
            }
        }
    },
    methods: {
        goBack() {
            YK_JSBridge.closePage();
        },
        limitNameInput() {
            this.customerInfoName = this.customerInfoName
                .replace(/\s+/g, '')
                .replace(/[^\u4E00-\u9FA5|·]/g, '');
            this.validModulesInfo();
        },
        limitCardInput() {
            this.customerInfoIdNo = this.customerInfoIdNo
                .replace(/\s+/g, '')
                .replace(/[^A-Za-z0-9]/g, '');
            this.validModulesInfo();
        },
        // 上传身份证图片(桥接)
        uploadCardHandle(type) {
            // 调起桥接
            YK_JSBridge.callPhoto('', res => {
                this[type] = res;
                this.getIdCardInfo(type, res);
            });
        },
        /* 获取身份证信息 */
        getIdCardInfo(type, imgBase64) {
            const data = {
                //personNo: mf160730170582
                type: type === 'defaultFront' ? 1 : 2,
                personNo: this.$store.state.userInfo.personNo, // store获取
                image: imgBase64 || idCardHead, // base64
                autHeadPortrait: '' // 头像图片
            };
            this.$api('/register/faceIdCardCheck', data).then(res => {
                // console.log('faceIdCardCheck', res);
                if (res.resultCode === '1000') {
                    if (type === 'defaultFront') {
                        const { workCity, optName, idNo } = res.data;
                        this.customerInfoIdNo = idNo;
                        this.customerInfoName = optName;
                        this.customerInfoAdress = workCity;
                    } else {
                        const { cardValidity, cardExpiryDate } = res.data;
                        this.cardValidity = cardValidity;
                        this.cardExpiryDate = cardExpiryDate;
                    }
                    this.validModulesInfo();
                } else {
                    console.log('faceIdCardCheck', res);
                    Toast(res.resultMsg);
                }
            });
        },
        closeHandler(value) {
            this[value] = '';
            this.validModulesInfo(value);
        },
        // 验证不能为空
        validModulesInfo(isToast) {
            if (isEmpty(strTrim(this.customerInfoName))) {
                if (isToast === 'customerInfoName') {
                    Toast('请输入姓名');
                }
                return false;
            }
            if (isEmpty(strTrim(this.customerInfoIdNo))) {
                if (isToast === 'customerInfoIdNo') {
                    Toast('请输入身份证号');
                }
                return false;
            }
            if (isEmpty(strTrim(this.customerInfoAdress))) {
                if (isToast === 'customerInfoAdress') {
                    Toast('请输入身份证住址');
                }
                return false;
            }
            if (isEmpty(this.defaultFront)) {
                // Toast('请上传身份证正面照');
                return false;
            }
            if (isEmpty(this.defaultBack)) {
                // Toast('请上传身份证反面照');
                return false;
            }
            return true;
        },
        // 保存数据接口
        saveInfo() {
            const userInfo = this.$store.state.userInfo;
            const data = {
                personNo: userInfo.personNo,
                idNo: this.customerInfoIdNo, // 身份证号
                employeeName: this.customerInfoName, //姓名
                address: this.customerInfoAdress, //地址
                validityBegin: this.cardValidity, //有效期开始
                validityEnd: this.cardExpiryDate //有效期结束
            };
            this.$api('/register/saveIdCard', data).then(res => {
                if (res.resultCode === '1000') {
                    this.checkJumpType();
                } else {
                    Toast(res.resultMsg);
                }
            });
        }
    },
    components: {
        NavBar
    }
};
</script>

<style lang="scss" scoped>
.section {
    background: #f4f5f7;
    height: calc(100vh-44px);
    .btn {
        position: fixed;
        bottom: 30px;
        width: 320px;
        height: 50px;
        margin-left: 26px;
        // margin: 0 auto;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 50px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        opacity: 1;
        &:disabled {
            opacity: 0.9;
            color: rgba(255, 255, 255, 0.6);
            background-image: linear-gradient(90deg, #4dc6a4 0%, #1daf83 99%);
        }
    }
    h1 {
        line-height: 54px;
        height: 44px;
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
        padding-left: 15px;
    }
    .info-content {
        background: #ffffff;
        margin-top: 10px;
        .card-text {
            position: relative;
            padding: 15px 15px 0 15px;
            font-size: 12px;
            font-weight: 400;
            color: #ff4800;
            line-height: 12px;
        }
    }
    .info-box {
        background: #ffffff;
        .card-main {
            position: relative;
            height: 140px;
            padding: 0 5px;
            .card-img-front {
                position: absolute;
                top: 10px;
                left: 15px;

                img {
                    width: 167.5px;
                    height: 105px;
                }
            }

            .card-img-back {
                position: absolute;
                top: 10px;
                right: 15px;

                img {
                    width: 167.5px;
                    height: 105px;
                }
            }

            .card-front {
                position: absolute;
                left: 5px;
                width: 187.5px;
                height: 125px;
                background-image: url('../assets/img/idCard/card-rx.png');
                background-position: center top;
                background-size: cover;
            }

            .card-back {
                position: absolute;
                right: 5px;
                width: 188px;
                height: 125px;
                background-image: url('../assets/img/idCard/card-gh.png');
                background-position: center top;
                background-size: cover;
            }

            p {
                margin-top: 80px;
                text-align: center;
                color: #999999;
                font-size: 12px;

                i {
                    font-style: normal;
                    color: #0a9c70;
                }
            }
        }
    }
}

.item {
    padding: 21px 15px 0 15px;
    p {
        line-height: 32px;
        font-size: 13px;
        font-weight: 400;
        color: #c8c8c8;
        position: relative;

        i {
            color: rgba(255, 127, 33, 1);
            font-style: normal;
        }

        span {
            position: absolute;
            right: 0;
        }

        &.label {
            font-size: 16px;
            color: #000000;
            line-height: 38px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            input {
                font-size: 16px;
                font-weight: bold;
                line-height: 38px;
            }
            textarea {
                padding-top: 10px;
                font-size: 16px;
                font-weight: bold;
                line-height: 22px;
                outline: none;
                resize: none;
            }
        }

        &.input-w {
            input,
            textarea {
                width: 330px;
                background-color: transparent;
            }
        }
    }
}

.title {
    padding-bottom: 3px;
    font-size: 14px;
    color: #3a3f43;
    line-height: 15px;
}

.f-title {
    position: relative;
    padding-bottom: 10px;

    .f-head {
        font-size: 12px;
        font-weight: 400;
        color: #9f9f9f;
        line-height: 15px;
        padding-left: 7px;
        position: relative;

        &:before {
            content: '';
            position: absolute;
            left: 0;
            width: 2px;
            height: 12px;
            background: #1e86ff;
            border-radius: 1px;
        }

        .f-right {
            position: absolute;
            top: 0;
            right: 0;
            color: #cfcfcf;
            padding-right: 10px;

            i {
                position: absolute;
                right: 0;
            }
        }
    }
}

.bottom {
    border-bottom: 1px solid #ebeced;
}

.i-close {
    position: absolute;
    z-index: 4;
    width: 16px;
    height: 16px;
    transform: translateY(-50%);
    top: 50%;
    background-position: center top;
    background-size: cover;
    background-image: url('../assets/img/idCard/clear.png');
}

.i-phone {
    position: absolute;
    z-index: 4;
    width: 30px;
    height: 24px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    background-position: center top;
    background-size: cover;
    background-image: url('../assets/img/idCard/phone.png');
}
input[placeholder],
textarea[placeholder] {
    font-weight: 500;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
    font-weight: 500;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
    font-weight: 500;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
    font-weight: 500;
}
</style>
