<template>
    <div class="main-content">
        <nav-bar
            title="登记信息"
            @back="goBack"
            :searchVisible="false"
        ></nav-bar>
        <div class="content">
            <div class="user-info">
                <div class="mobile">
                    <p>
                        <span class="shutiao"></span>
                        确认用户信息
                    </p>
                    <div class="input">
                        <input
                            type="tel"
                            v-model="mobile"
                            maxlength="11"
                            placeholder="请输入手机号"
                            @paste="limitMobileInput"
                            @keyup="limitMobileInput"
                            @blur="verifyInputMobile"
                        />
                        <img
                            v-show="mobile"
                            class="clear"
                            src="@/assets/img/applyList/clear.png"
                            alt
                            @click="mobile = ''"
                        />
                        <button
                            class="add-btn"
                            :disabled="!mobile"
                            @click="getOrderInfo"
                        >
                            添加
                        </button>
                    </div>
                </div>
                <div class="order" v-show="loanNo">
                    <div class="order-contet">
                        <span class="title">订单信息</span>
                        <ul class="list">
                            <li>
                                <span>订单号</span>
                                <span class="val">{{ loanNo }}</span>
                            </li>
                            <li>
                                <span>分期金额</span>
                                <span class="val">
                                    ￥{{ Number(loanAmt).toFixed(2) }}
                                </span>
                            </li>
                            <li>
                                <span>下单时间</span>
                                <span class="val">{{ dateTime }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="main-border address">
                <p>
                    <span class="shutiao"></span>
                    收货地址
                </p>
                <textarea v-model="address" placeholder="请输入收货地址" />
                <img
                    v-show="address"
                    class="clear"
                    src="@/assets/img/applyList/clear.png"
                    alt
                    @click="address = ''"
                />
            </div>
            <div class="main-border upload">
                <p>
                    <span class="shutiao"></span>
                    拍摄/上传照片
                </p>
                <div class="upload-img" @click="uploadCardHandle">
                    <img
                        :src="'data:image/jpg;base64,' + updateImageFile"
                        v-if="updateImageFile"
                    />
                    <div
                        class="add-tips"
                        :class="updateImageFile ? 'active' : ''"
                    >
                        <img
                            :src="updateImageFile ? addIcon1 : addIcon"
                            class="add-icon"
                        />
                        <span style="font-size:12px">添加图片</span>
                    </div>
                </div>
                <span class="upload-tips">(非必填项目，没有则无需上传)</span>
            </div>
            <div class="footer">
                <button
                    class="btn"
                    type="button"
                    :disabled="!disableSubmit"
                    @click="savaSubmit"
                >
                    提交
                </button>
                <ul class="tips">
                    <li>
                        <i class="tips-icon"></i>
                        温馨提示
                    </li>
                    <li>
                        <b style="margin-right:5px">·</b>
                        请确保上传的凭证真实有效
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import navBar from '@/components/common/navBar.vue';
import { validate, isEmpty, strTrim } from '@/assets/js/utils.js';
import { YK_JSBridge } from '@/assets/js/JSBride.js';
import moment from 'moment';
export default {
    data() {
        return {
            mobile: '',
            address: '',
            addIcon: require('../assets/img/index/add-icon.png'),
            addIcon1: require('../assets/img/index/add-icon1.png'),
            // updateImageFile: require('../assets/img/index/banner_1.png')
            updateImageFile: '',
            createTime: '',
            loanNo: '',
            loanAmt: 0,
            dateTime: ''
        };
    },
    components: {
        navBar
    },
    computed: {
        disableSubmit() {
            return this.validModulesInfo();
        }
    },
    methods: {
        validModulesInfo() {
            if (
                isEmpty(strTrim(this.mobile)) ||
                !validate.mobile.test(this.mobile) ||
                isEmpty(strTrim(this.address)) ||
                isEmpty(strTrim(this.loanNo))
            ) {
                return false;
            }
            return true;
        },
        // 匹配数字
        limitMobileInput() {
            this.mobile = this.mobile.replace(/\D/g, '');
        },
        /* 失去焦点验证手机号 */
        verifyInputMobile() {
            if (isEmpty(strTrim(this.mobile))) {
                Toast({
                    message: '请输入手机号码',
                    duration: 1000
                });
            } else if (!validate.mobile.test(this.mobile)) {
                Toast({
                    message: '请输入正确的手机号码',
                    duration: 1000
                });
            }
        },
        // 上传图片桥接
        uploadCardHandle() {
            YK_JSBridge.callPhoto('', res => {
                this.updateImageFile = res;
            });
        },
        // 获取订单信息
        getOrderInfo() {
            this.$api('/sm-api/gift/gold/load', { mobile: this.mobile }).then(
                res => {
                    if (res.data.code === 0) {
                        const {
                            createTime,
                            loanNo,
                            loanAmt
                        } = res.data.data.data;
                        this.loanAmt = loanAmt;
                        this.loanNo = loanNo;
                        this.createTime = createTime;
                        this.dateTime = moment(createTime).format(
                            'YYYY-MM-DD HH:mm'
                        );
                    } else {
                        Toast(res.data.showMsg || '请求异常');
                    }
                }
            );
        },
        // 提交
        savaSubmit() {
            const params = {
                mobile: this.mobile,
                loanNo: this.loanNo,
                loanAmount: this.loanAmt,
                loanDate: this.createTime,
                shippingAddress: this.address,
                marriageCertificate: this.updateImageFile
            };
            this.$api('/sm-api/gift/gold/save', params).then(res => {
                if (res.data.code === 0) {
                    // 调转成功页
                    this.$router.push({
                        name: 'ResultPage'
                    });
                } else {
                    Toast(res.data.showMsg || '失败');
                }
            });
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.main-content {
    background: #f3f5f7;
}
.content {
    background: #f3f5f7;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    flex-direction: column;
    .shutiao {
        display: inline-block;
        width: 2px;
        height: 14px;
        border-radius: 4px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        margin-right: 1px;
        vertical-align: -2px;
    }
    .user-info {
        width: 340px;
        background: #fff;
        margin: 10px 0;
        border-radius: 8px;
        .mobile {
            padding: 16px 14px 10px 14px;
        }
        .input {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            position: relative;
            input {
                font-size: 17px;
                flex: 1;
            }
            .clear {
                position: absolute;
                right: 80px;
                top: 5px;
                display: inline-block;
                width: 14px;
                height: 14px;
            }
        }
        .add-btn {
            display: inline-block;
            text-align: center;
            color: #fff;
            width: 59px;
            height: 28px;
            line-height: 28px;
            border-radius: 24px;
            font-size: 12px;
            background-image: linear-gradient(90deg, #4dc6a4 0%, #1daf83 100%);
            opacity: 1;
            &:disabled {
                color: rgba(255, 255, 255, 0.6);
                opacity: 0.7;
            }
        }
        .order {
            background: #f5fcfa;
            border-radius: 0 0 8px 8px;
            padding: 0 14px 14px 14px;
            .order-contet {
                border-top: 1px solid #dedede;
            }
            .title {
                display: inline-block;
                font-size: 14px;
                padding: 15px 0 5px 0;
            }
            .list {
                color: #5a6066;
                font-size: 12px;
                margin-top: 5px;
                li {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 5px;
                }
                .val {
                    color: #262c32;
                }
            }
        }
    }
    .main-border {
        width: 340px;
        margin-bottom: 12px;
        background: #fff;
        padding: 16px 14px 4px 14px;
        border-radius: 8px;
        p {
            margin-bottom: 10px;
        }
    }
    .address {
        position: relative;
        textarea {
            width: 290px;
            font-size: 14px;
        }
        .clear {
            position: absolute;
            right: 20px;
            bottom: 32px;
            display: inline-block;
            width: 14px;
            height: 14px;
        }
    }
    .upload {
        padding-bottom: 20px;
        .upload-img {
            width: 210px;
            height: 120px;
            margin: 20px auto 6px auto;
            background: #fafafa;
            border: 1px dashed #d8d8d8;
            border-radius: 8px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
            .add-tips {
                width: 120px;
                height: 70px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                .add-icon {
                    width: 30px;
                    height: 26px;
                    display: block;
                    margin: 3px auto;
                }
            }
            .active {
                background-color: rgba(0, 0, 0, 0.2);
                color: #fff;
                border-radius: 8px;
            }
        }
        .upload-tips {
            display: inline-block;
            width: 100%;
            text-align: center;
            color: #999;
            font-size: 13px;
        }
    }
    .footer {
        .btn {
            width: 320px;
            height: 50px;
            margin-top: 15px;
            background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
            border-radius: 50px;
            font-size: 16px;
            color: #fff;
            text-align: center;
            opacity: 1;
            &:disabled {
                opacity: 0.9;
                color: rgba(255, 255, 255, 0.6);
                background-image: linear-gradient(
                    90deg,
                    #4dc6a4 0%,
                    #1daf83 99%
                );
            }
        }
        .tips {
            font-size: 12px;
            margin: 20px 0 40px 0;
            color: #999;
            li {
                margin-top: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
        }
        .tips-icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-right: 5px;
            background-image: url('../assets/img/index/tip.png');
            background-size: 100% 100%;
        }
    }
}
input::placeholder,
textarea::placeholder {
    color: #999;
    font-size: 16px;
}
</style>
