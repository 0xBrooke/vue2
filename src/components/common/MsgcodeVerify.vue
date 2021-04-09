<template>
    <div class>
        <mt-popup class="popup-reset" v-model="popupVisible" position="bottom">
            <div class="popup-box">
                <div class="title">
                    <img
                        src="@/assets/img/bank/close.png"
                        @click="popupVisible = false"
                    />
                </div>
                <div class="con-box" ref="listbox" @touchmove.stop>
                    <div class="title-box">
                        <p class="code-title">输入短信验证码</p>
                        <p class="code-desc">
                            验证码已发送至{{ phoneNo | formatMobile }}
                        </p>
                    </div>
                    <p class="time">
                        <button
                            ref="getcode"
                            disabled
                            @click="getCode('getcode')"
                            :class="isRestart ? 'restart' : ''"
                        >
                            {{ msgCodeText }}
                        </button>
                    </p>
                    <div class="input-box" ref="inputBox">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="keyboard">
                    <ul @click="getBtnValue($event)">
                        <li>
                            <button>1</button>
                            <button>2</button>
                            <button>3</button>
                        </li>
                        <li>
                            <button>4</button>
                            <button>5</button>
                            <button>6</button>
                        </li>
                        <li>
                            <button>7</button>
                            <button>8</button>
                            <button>9</button>
                        </li>
                        <li>
                            <span></span>
                            <button>0</button>
                            <span class="delete-btn" @click="deleteCode"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
export default {
    name: 'MsgCodePop',
    props: {
        showMsgPop: {
            type: Boolean,
            default() {
                return false;
            }
        },
        phoneNo: {
            type: String
        },
        resizeTime: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            popupVisible: false,
            msgCode: [], // 验证码
            seconds: 60, // 倒计时剩余时间,
            msgCodeText: '',
            isRestart: false, // 是否重新获取
            timer: null,
            business_scene: ''
        };
    },
    watch: {
        showMsgPop(val) {
            this.popupVisible = val;
            // 解决滑动弹窗穿透问题
            // if (val) {
            //   document.body.style.position = "fixed";
            //   document.body.style.width = "100%";
            // } else {
            //   document.body.style.position = "static";
            // }
            if (val) {
                if (this.seconds > 0) {
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    this.countDown();
                }
                if (this.seconds <= 0) {
                    this.getCode();
                }
            } else {
                this.seconds = 60;
                this.msgCode = [];
                window.clearInterval(this.timer);
            }
        },
        popupVisible(val) {
            if (!val) {
                this.$emit('resetMsgCodePop', val);
                // document.body.style.pointerEvents = 'none';
                // document.querySelector('.popup-reset').style.pointerEvents = 'auto';
                // 点击 X 关闭弹窗,清除fixed
                // document.body.style.position = "";
                // 解决第二次打开弹窗,划不动问题
                // this.$refs.listbox.scrollTop = 0;
            }
        },
        msgCode(val) {
            // let that = this;
            let inputBox = this.$refs.inputBox.children;
            // 将Dom list伪数组转化为标准数组
            var inputBoxArr = Array.prototype.slice.call(inputBox);
            // 将输入框初始化未空
            inputBoxArr.map(item => {
                item.innerText = '';
            });
            val.map((num, index) => {
                // 获取输入框dom节点
                let inputBox = this.$refs.inputBox.children;
                // 输入框显示code
                inputBox[index].innerText = num;
            });

            if (val.length === 1) {
                this.$emit('buryMsgInput', 'H5StartInput');
            }
            setTimeout(() => {
                // 当输入6位时请求接口
                if (val.length === 6) {
                    this.$emit('buryMsgInput', 'H5EndInput');
                    // 将msgcode数组转换为字符串，并传给父组件
                    this.$emit('verifyMsgCode', val.join(''));
                }
            }, 0);
        },
        resizeTime() {
            this.getCode();
        }
    },

    filters: {
        formatMobile(value) {
            if (value && value.indexOf('*') === -1) {
                const val = value && value.replace(/\D/g, ''); // 如果手机号有空格，需将空格去除
                value =
                    val && val.replace(/(\d{3})\d{4}(\d{4})/g, '$1 **** $2');
            }
            return value;
        }
    },
    methods: {
        /* 输入验证码 */
        getBtnValue(e) {
            if (e.target && e.target.nodeName === 'BUTTON') {
                if (this.msgCode.length < 6) {
                    this.msgCode.push(e.target.innerText);
                }
            }
        },
        /* 删除验证码 */
        deleteCode(e) {
            this.msgCode.pop();
            e.stopPropagation();
        },
        countDown() {
            this.isRestart = false;
            this.$refs.getcode &&
                this.$refs.getcode.setAttribute('disabled', 'disabled');
            this.msgCodeText = `${this.seconds}s后重新发送`;
            this.timer = window.setInterval(() => {
                this.seconds--;
                this.msgCodeText = `${this.seconds}s后重新发送`;
                if (this.seconds < 1) {
                    window.clearInterval(this.timer);
                    this.msgCodeText = '重新发送';
                    this.$refs.getcode &&
                        this.$refs.getcode.removeAttribute('disabled');
                    this.isRestart = true;
                }
            }, 1000);
        },

        getCode(val) {
            window.clearInterval(this.timer);
            this.seconds = 60;
            this.msgCodeText = `${this.seconds}s后重新发送`;
            this.countDown();
            this.$emit('sendOut', val); // 点击重新发送用以前loading，点击确认借款用新loading
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
    overflow: hidden;
    .popup-box {
        background: #fff;
        border-radius: 10px 10px 0 0;
        .title {
            position: relative;
            height: 40px;
            line-height: 40px;
            img {
                position: absolute;
                left: 15px;
                top: 15px;
                width: 14px;
                height: 14px;
            }
        }
        .con-box {
            overflow: hidden;
            padding: 0 20px;
            .title-box {
                text-align: left;
                margin-top: 10px;
                .code-title {
                    font-size: 25px;
                    color: #141414;
                    margin-bottom: 10px;
                }
                .code-desc {
                    font-size: 12px;
                    color: #999;
                }
            }
            .time {
                height: 18px;
                line-height: 18px;
                font-size: 12px;
                color: #999;
                margin-top: 40px;
                margin-bottom: 14px;
                text-align: right;
                button {
                    background: #fff;
                    color: #999;
                }
                .restart {
                    color: #3794ff;
                }
            }
            .input-box {
                text-align: center;
                display: flex;
                justify-content: space-between;
                span {
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    border: 1px solid #999;
                    border-radius: 3px;
                    font-size: 32px;
                }
            }
        }
        .keyboard {
            margin-top: 37px;
            background: rgba(210, 213, 219, 0.9);
            padding: 6px 6px 1px 6px;
            ul {
                li {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                    button,
                    span {
                        // cursor: pointer;
                        display: inline-block;
                        height: 46px;
                        text-align: center;
                        width: 117px;
                        background: #ffffff;
                        box-shadow: 0 1px 0 0 #848688;
                        border-radius: 5px;
                        font-size: 20px;
                    }
                    button:active {
                        background: rgba(210, 213, 219, 0.9);
                    }
                    span {
                        box-shadow: 0 0 0 0;
                        background: rgba(210, 213, 219, 0.9);
                    }
                    .delete-btn:active {
                        background: #fff;
                    }
                    .delete-btn {
                        background: url('../../assets/img/bank/delete.png')
                            no-repeat center;
                        background-size: 25% auto;
                    }
                }
            }
        }
    }
}
</style>
