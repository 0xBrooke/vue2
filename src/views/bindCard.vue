<template>
    <div class="real-name-container">
        <nav-bar title="绑定银行卡号" @back="goBack"></nav-bar>
        <div class="wrap">
            <div class="input-group">
                <div class="input-box">
                    <p>姓名</p>
                    <input
                        v-if="accountReturnName"
                        readonly="readonly"
                        v-model="accountReturnName"
                    />
                    <template v-else>
                        <input
                            name="accountName"
                            v-model="accountName"
                            maxlength="15"
                            type="text"
                            @paste="limitAccountNameInput"
                            @keyup="limitAccountNameInput"
                            @blur="verifyInputAccountName"
                            placeholder="请输入姓名"
                        />
                        <div class="icon-box">
                            <span
                                v-if="accountName !== ''"
                                @click="accountName = ''"
                                class="clear"
                            ></span>
                        </div>
                    </template>
                </div>
                <div class="input-box">
                    <p>本人身份证号</p>
                    <input
                        v-if="idReturnCard"
                        readonly="readonly"
                        v-model="idReturnCard"
                    />
                    <template v-else>
                        <input
                            type="text"
                            name="idCard"
                            v-model="idCard"
                            maxlength="18"
                            @paste="limitIdCardInput"
                            @keyup="limitIdCardInput"
                            @blur="verifyInputIdCard"
                            placeholder="请输入本人身份证号"
                        />
                        <div class="icon-box">
                            <span
                                v-if="idCard !== ''"
                                @click="idCard = ''"
                                class="clear"
                            ></span>
                        </div>
                    </template>
                </div>
                <div class="input-box">
                    <p>银行名称</p>
                    <div class="bank-name" @click="showSupportBankPop = true">
                        <input
                            type="text"
                            v-model="bankName"
                            readonly="readonly"
                            placeholder="请选择银行"
                        />
                        <img src="@/assets/img/common/right.png" />
                    </div>
                </div>
                <div class="input-box">
                    <p>
                        银行卡号
                    </p>
                    <input
                        type="tel"
                        name="bankCardNo"
                        v-model="bankCardNoShow"
                        maxlength="23"
                        ref="bankCardInput"
                        @keyup="limitBankCardNoInput"
                        @blur="verifyInputBankCardNo"
                        placeholder="请输入本人银行卡号"
                    />
                    <div class="icon-box">
                        <span
                            v-if="bankCardNoShow !== ''"
                            @click="handDel"
                            class="clear"
                        ></span>
                    </div>
                </div>
                <div class="input-box">
                    <p>银行预留手机号</p>
                    <input
                        type="tel"
                        name="mobile"
                        v-model="mobile"
                        maxlength="11"
                        @paste="limitMobileInput"
                        @keyup="limitMobileInput"
                        @blur="verifyInputMobile"
                        placeholder="请输入银行预留手机号"
                    />
                    <div class="icon-box">
                        <span
                            v-if="mobile"
                            @click="hasInfoClear"
                            class="clear"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部按钮 -->
        <next-arg
            v-show="footerShow"
            @getArgList="getArgList"
            @nextStep="bindCardNextStep"
            :hasRealInfo="hasRealInfo"
        ></next-arg>
        <!-- 银行卡列表 -->
        <bank-list
            :showSupportBankList="showSupportBankPop"
            @resetBankListPop="resetBankListPop"
            :supportBankListData="supportBankListData"
            @bankSelected="bankSelected"
            :bankCode="bankCode"
        ></bank-list>
        <!-- 短信验证码 -->
        <msgcode-verify
            @verifyMsgCode="verifyMsgCode"
            @resetMsgCodePop="resetMsgCodePop"
            :phoneNo="mobile"
            :showMsgPop="showMsgPop"
        ></msgcode-verify>
        <!-- 协议列表 -->
        <arg-list
            :isShowAgreementList="showArgList"
            :agreementListData="agrListData"
            @argDetail="argDetail"
            @getShowState="getShowState"
        ></arg-list>
    </div>
</template>

<script>
import BankList from '@/components/common/bankList.vue';
import NextArg from '@/components/openCount/NextAndArg.vue';
import NavBar from '@/components/common/navBar.vue';
import MsgcodeVerify from '@/components/common/MsgcodeVerify.vue';
import ArgList from '@/components/common/agreementList.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';
import { validate, getUrlParam, bankCardFormat } from '@/assets/js/utils.js';
import userCheck from '@/assets/js/userCheck.js';

export default {
    name: 'BindCard',
    mixins: [userCheck],
    data() {
        return {
            personNo: '',
            showArgList: false, // 是否显示协议列表弹窗
            showConfirmApplyPop: false, // 显示确定退出申请弹窗
            showSupportBankPop: false, // 显示支持的银行列表
            agrListData: [], // 协议列表
            supportBankListData: [], // 支持的银行列表
            showMsgPop: false, // 短信验证码弹窗
            accountName: '', // 姓名
            idCard: '', // 身份证号
            bankCardNo: '', //储蓄卡号
            bankCardNoShow: '', // 储蓄卡号-显示
            bankCode: '', // 银行code
            bankName: '', //储蓄卡所属银行名称
            mobile: '', // 手机号
            showClear: '',
            isMobileReg: false,
            idCardInfoReturn: false,
            accountReturnName: '', // 返回的姓名
            idReturnCard: '',
            businessScene: '',
            // 软键盘问题
            footerShow: true,
            screenHeight: document.documentElement.clientHeight, //此处也可能是其他获取方法
            originHeight: document.documentElement.clientHeight
        };
    },
    components: {
        BankList,
        NextArg,
        NavBar,
        MsgcodeVerify,
        ArgList
    },
    computed: {
        /*
      下一步可点击条件:四要素非空且合规,false可点击,true不可点击,有回显信息
        1.姓名:accountReturnName有值,accountName不校验;accountReturnName无值,accountName校验
        2.身份证:idReturnCard有值,idCard不校验;idReturnCard无值,idCard校验
        3.bankCardNo校验
        4.mobile中间四位为*号不校验,否则mobile校验
        1234校验通过,下一步按钮可点击
     */
        hasRealInfo() {
            let status;
            let nameReg, idReg, mobileReg, cardReg, bankCodeReg;
            if (
                this.accountReturnName ||
                (this.accountName && !validate.name.test(this.accountName))
            ) {
                nameReg = true;
            }
            if (
                this.idReturnCard ||
                (this.idCard && validate.idCardReg.test(this.idCard))
            ) {
                idReg = true;
            }
            if (
                this.bankCardNo &&
                validate.bankCardNo.test(this.bankCardNo.replace(/\s+/g, ''))
            ) {
                cardReg = true;
            }
            if (
                this.mobile.indexOf('****') !== -1 ||
                validate.mobile.test(this.mobile)
            ) {
                mobileReg = true;
            }
            if (this.bankCode) {
                bankCodeReg = true;
            }
            status = nameReg && idReg && mobileReg && cardReg && bankCodeReg;
            return status ? false : true;
        },
        fromSource() {
            return (
                this.$store.state.channel ||
                getUrlParam('fromSource') ||
                this.$route.query.fromSource
            );
        }
    },
    created() {
        window.backToLoanHomeView = this.backToLoanHomeView
            ? this.backToLoanHomeView
            : null;
        let {
            employeeName,
            bankMobile,
            employeeIdentityNo,
            bankCardNo,
            personNo
        } = this.$store.state.userInfo;
        this.accountReturnName = employeeName || '';
        this.idReturnCard = employeeIdentityNo || '';
        this.mobile = bankMobile || '';
        this.bankCardNoShow = bankCardFormat(bankCardNo);
        this.bankCardNo = bankCardNo || '';
        this.personNo = personNo || '';
    },
    mounted() {
        // 获取支持的银行列表
        this.getSupportBankList();
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
        handDel() {
            this.bankCardNo = '';
            this.bankCardNoShow = '';
            this.bankName = '';
        },
        hasInfoClear() {
            this.mobile = '';
            this.isMobileReg = true;
        },
        backToLoanHomeView() {
            this.showConfirmApplyPop = true;
        },
        // 获取选中的银行卡信息
        bankSelected(bankInfo) {
            this.bankCode = bankInfo.bankCode;
            this.bankName = bankInfo.bankName;
        },
        /* 失去焦点验证身份证 */
        verifyInputIdCard() {
            this.idCard = this.idCard.replace(/[ ]/g, '');
            if (this.idCard === '') {
                Toast({
                    message: '请输入本人身份证号',
                    duration: 1000
                });
                return;
            } else if (!validate.idCardReg.test(this.idCard)) {
                Toast({
                    message: '请输入18位正确身份证号码',
                    duration: 1000
                });
                return;
            }
        },
        /* 失去焦点验证姓名 */
        verifyInputAccountName() {
            this.accountName = this.accountName.replace(/[ ]/g, '');
            if (this.accountName === '') {
                Toast({
                    message: '请输入姓名',
                    duration: 1000
                });
                return;
            } else if (validate.name.test(this.accountName)) {
                Toast({
                    message: '姓名格式不正确',
                    duration: 1000
                });
                return;
            }
        },
        /* 本人储值卡号输入限制:匹配非数字 */
        limitBankCardNoInput() {
            const bankInput = this.$refs.bankCardInput;
            if (bankInput.selectionStart < this.bankCardNoShow.length) {
                return;
            }
            this.bankCardNoShow = bankCardFormat(
                this.bankCardNoShow.replace(/\D/g, '')
            );
            this.bankCardNo = this.bankCardNoShow.replace(/\s+/g, '');
        },
        /* 失去焦点验证银行卡号 */
        verifyInputBankCardNo() {
            const bankCardNo = this.bankCardNo;
            if (bankCardNo === '') {
                Toast({
                    message: '请输入本人银行卡号',
                    duration: 1000
                });
            } else if (!validate.bankCardNo.test(bankCardNo)) {
                Toast({
                    message: '请输入正确的银行卡号',
                    duration: 2000
                });
            } else {
                this.bankCardNoShow = bankCardFormat(
                    this.bankCardNoShow.replace(/\D/g, '')
                );
            }
        },
        /* 失去焦点验证手机号 */
        verifyInputMobile() {
            this.mobile = this.mobile.replace(/[ ]/g, '');
            if (this.mobile === '') {
                Toast({
                    message: '请输入银行预留手机号',
                    duration: 1000
                });
            } else if (!validate.mobile.test(this.mobile)) {
                Toast({
                    message: '请输入正确的手机号码',
                    duration: 1000
                });
            }
        },
        /* 手机号输入限制:匹配非数字 */
        limitMobileInput() {
            this.mobile = this.mobile.replace(/\D/g, '');
        },
        /* 本人身份证号输入限制 */
        limitIdCardInput() {
            this.idCard = this.idCard
                .replace(/[ ]/g, '')
                .replace(/[^A-Za-z0-9]/g, '');
        },
        /* 姓名输入限制:匹配非中文字符和· */
        limitAccountNameInput() {
            this.accountName = this.accountName
                .replace(/[ ]/g, '')
                .replace(/[^\u4E00-\u9FA5|·]/g, '');
        },
        // 显示协议列表弹窗
        getArgList() {
            // 获取协议列表
            this.$api('/sm-api/agreement/queryAgreementList', {
                workFlow: 'myf_binding_bankcard'
            }).then(res => {
                if (res.code === 0) {
                    this.agrListData = res.data.agreementList;
                    this.showArgList = true;
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        // 查看协议详情
        argDetail(item) {
            this.$router.push({
                name: 'agreementDetails',
                query: {
                    title: item.agreementName,
                    agreementType: item.agreementType
                }
            });
        },
        getShowState(val) {
            this.showArgList = val;
        },
        // 获取支持的银行列表
        async getSupportBankList() {
            // /sm-api/supportBanks/query
            this.$api('/bankCard/bank/list')
                .then(res => {
                    console.log('dd', res);
                    if (res.resultCode === '1000') {
                        this.supportBankListData = res.data.bankCardList;
                    } else {
                        Toast(res.resultMsg);
                    }
                })
                .catch(err => {
                    console.log('err:', err);
                });
        },
        resetBankListPop(val) {
            this.showSupportBankPop = val;
        },
        resetMsgCodePop(val) {
            this.showMsgPop = val;
        },
        /* 点击下一步 */
        async bindCardNextStep() {
            this.getMsgCode();
        },
        /* 获取短信验证码 */
        async getMsgCode() {
            let data = {
                bankCode: this.bankCode, //银行编码
                idNo: this.idCard || this.idReturnCard, // 身份证
                cardNo: this.bankCardNo, // 卡号
                optNo: this.personNo,
                cardName: this.accountReturnName || this.accountName, // 持卡人姓名
                bankName: this.bankName, // 银行名称
                telephone: this.mobile
            };
            let res = await this.$api('/bankCard/bind/apply', data);
            if (res.resultCode === '1000') {
                this.showMsgPop = true; // 显示短验输入框
            } else {
                Toast(res.resultMsg);
            }
        },
        /* 短信验证码、协议去绑卡 */
        async verifyMsgCode(val) {
            const cardNo = this.bankCardNo;
            let params = {
                userId: this.personNo,
                userName: this.accountReturnName || this.accountName,
                idNo: this.idCard || this.idReturnCard,
                workFlow: 'myf_binding_bankcard', // 获取协议列表的标识
                phoneCode: val, // 短信验证码
                mobile: this.mobile,
                bankCode: this.bankCode, //银行编码
                cardNo, // 卡号
                optNo: this.personNo
            };
            let res = await this.$api(
                '/bangKe/agreementBankCardBinding',
                params
            );
            if (res.resultCode === '1000') {
                // 跳转页面
                this.checkJumpType();
            } else {
                Toast(res.resultMsg);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.real-name-container {
    background: #f4f5f7;
    height: calc(100vh-44px);
    .header-icons {
        top: 21px;
        left: 10px;
        position: fixed;
        span {
            margin: 0 10px;

            img {
                width: 22px;
                height: 22px;
            }
        }
    }

    .wrap {
        box-sizing: border-box;
        padding: 24px 20px 0 20px;
        position: relative;
        background: #fff;
        .real-name-tips {
            position: absolute;
            left: 0;
            top: -1px;
            z-index: 3;
            background: url('../assets/img/openCount/real-name-tips.png')
                no-repeat center top;
            background-size: contain;
            width: 270px;
            height: 50px;

            span {
                padding-left: 31px;
                color: #ffffff;
                font-size: 14px;
                line-height: 51px;
                text-align: center;
            }

            &:before {
                content: '';
                position: absolute;
                left: 12px;
                top: 18px;
                z-index: 4;
                width: 14px;
                height: 14px;
                background: url('../assets/img/openCount/real-name-icon.png')
                    no-repeat center top;
                background-size: contain;
            }
        }

        .real-name-title {
            display: flex;
            flex-direction: column;
            justify-content: center;

            h3 {
                font-weight: normal;
                font-size: 20px;
                color: #1a1a1a;
                line-height: 40px;
            }

            p {
                font-size: 12px;
                color: #999999;
                line-height: 18px;
            }
        }

        .input-group {
            .input-box {
                width: 100%;
                margin-bottom: 20px;
                position: relative;
                .icon-box {
                    position: absolute;
                    right: 2px;
                    bottom: 10px;

                    .clear {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        background: url('../assets/img/openCount/clear.png')
                            no-repeat center;
                        background-size: contain;
                        margin-left: 10px;
                    }
                }

                p {
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #3a3f43;
                    display: block;
                    margin-bottom: 3px;
                    position: relative;
                }

                input {
                    font-size: 16px;
                    border: 0;
                    outline: 0;
                    caret-color: #3794ff;
                    width: 100%;
                    position: relative;
                    height: 40px;
                    border-bottom: 1px solid #ebeced;
                    line-height: 40px;
                }

                input::-webkit-input-placeholder {
                    color: #c8c8c8;
                    font-size: 16px;
                }
                .bank-name {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    img {
                        width: 10px;
                        height: 17px;
                    }
                }
            }
        }

        .argSignDesc {
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
            line-height: 18px;

            .argList {
                color: #3b96ff;
            }
        }

        .btn-box {
            margin-top: 15px;

            div {
                text-align: center;
                margin: 0 auto;
            }

            .nextStep {
                width: 320px;
                height: 45px;
                line-height: 45px;
                background: #1e86ff;
                border-radius: 22.5px;
                color: #fff;
                font-size: 16px;

                &:disabled {
                    background: rgba(30, 134, 255, 0.4);
                }
            }

            .noApply {
                margin-top: 18px;
                font-size: 13px;
                color: #1e86ff;
            }
        }
    }
}

@keyframes fadeInLeft {
    0% {
        left: -100%;
    }

    to {
        left: 0;
    }
}

@keyframes fadeOutLeft {
    0% {
        left: 0;
    }

    to {
        left: -100%;
    }
}

.fadeOutLeft {
    -webkit-animation-name: fadeOutLeft;
    animation-name: fadeOutLeft;
}

.fadeInLeft {
    -webkit-animation-name: fadeInLeft;
    animation-name: fadeInLeft;
}

.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
</style>
