<template>
    <div class="qr-container">
        <nav-bar title="我的二维码" @back="back"></nav-bar>
        <div class="qr">
            <div class="qr-top">
                <div class="head">
                    <div class="title">
                        <p>
                            <span
                                v-for="(item, index) in countString"
                                :key="index"
                                :class="{ none: item === ':' }"
                            >
                                {{ item }}
                            </span>
                            后自动刷新
                        </p>
                    </div>
                    <div class="btn" @click="refresh">点击刷新</div>
                </div>
                <div class="my-qr">
                    <mt-swipe
                        :auto="0"
                        :continuous="false"
                        :defaultIndex="defaultIndex"
                        ref="swipeWrapper"
                    >
                        <mt-swipe-item>
                            <div class="text">我的二维码 A</div>
                            <div class="qr-img">
                                <div
                                    class="border"
                                    id="qrCodeA"
                                    v-if="contentA"
                                ></div>
                            </div>
                            <div
                                @click="handleTab(1)"
                                class="handle right"
                            ></div>
                        </mt-swipe-item>
                        <mt-swipe-item>
                            <div class="text b">我的二维码 B</div>
                            <div class="qr-img b">
                                <div
                                    class="border"
                                    id="qrCodeB"
                                    v-if="contentB"
                                ></div>
                            </div>
                            <div
                                @click="handleTab(0)"
                                class="handle left"
                            ></div>
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
            </div>
            <div class="qr-bot">
                二维码5分钟有效，请尽快扫码哦
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import navBar from '@/components/common/navBar.vue';
export default {
    name: '',
    data() {
        return {
            qrCodeTimers: null, //  5分钟自动更新二维码
            validTimers: null, // 5s 轮询二维码是否有效
            refreshTimer: null,
            count: 300,
            countString: '',
            defaultIndex: 0,
            qrCodeA: null,
            qrCodeB: null,
            codeObj: {},
            contentA: '',
            contentB: ''
        };
    },
    computed: {
        saCode: function() {
            return this.$store.state.userInfo.personNo;
        }
    },
    created() {
        this.qrCodeCreate();
    },
    methods: {
        /* 验码结果 */
        getCheckResult() {
            this.$api('/sm-api/qrCode/getCheckResult', {
                saCode: this.saCode
            }).then(res => {
                if (res.data.code === 0) {
                    Toast('受理成功');
                    setTimeout(() => {
                        this.$router.replace({ name: 'Index' });
                    }, 3000);
                }
            });
        },
        /* 实现5分钟倒计时 */
        countDown() {
            let sec =
                parseInt(this.count % 60) < 10
                    ? '0' + parseInt(this.count % 60)
                    : parseInt(this.count % 60);
            this.countString = `0${parseInt((this.count / 60) % 60)}:${sec}`;
            this.refreshTimer = setTimeout(() => {
                --this.count;
                if (this.count === 0) {
                    clearTimeout(this.refreshTimer);
                    this.count = 300;
                    this.qrCodeCreate(); // 倒计时重置时刷新二维码
                }
                this.countDown();
            }, 1000);
        },
        /* 创建二维码前先移除二维码 */
        createQRCode(id, qrContent) {
            const dom = document.getElementById(id);
            dom.innerHTML = '';
            this.qrCodeA = new QRCode(dom, {
                text: qrContent,
                width: 185,
                height: 185,
                colorDark: '#000000',
                colorLight: '#ffffff'
            });
        },
        /* 生成AB码 */
        async qrCodeCreate() {
            const pos = JSON.parse(sessionStorage.getItem('gpsLocation'));
            if (pos && pos.latitude !== '') {
                const data = {
                    saLat: pos.latitude,
                    saLnt: pos.longitude,
                    saCode: this.saCode
                };
                this.$api('/sm-api/qrCode/create', data).then(res => {
                    if (res.data && res.data.code === 0) {
                        this.codeObj = res.data.data;
                        this.contentA = this.codeObj.A;
                        this.contentB = this.codeObj.B;
                        this.$nextTick(() => {
                            this.createQRCode('qrCodeA', this.contentA);
                            this.createQRCode('qrCodeB', this.contentB);
                        });
                        this.countDown();
                        /* 二维码生成成功之后每5秒轮询扫码结果 */
                        this.validTimers = setInterval(() => {
                            this.getCheckResult();
                        }, 5 * 1000);
                    } else {
                        Toast(res.data.showMsg);
                    }
                });
            } else {
                Toast('找不到gps定位');
            }
        },
        /* 校验AB码是否有效---原生未调该接口 */
        checkCode() {
            let code;
            if (this.defaultIndex === 0) {
                code = this.codeArray[0].qrCodeContent;
            } else {
                code = this.codeArray[1].qrCodeContent;
            }
            this.$api('/sm-api/qrCode/check', {
                qrCodeContent: code
            }).then(res => {
                if (res.data.data === '0') {
                    this.saCode = res.data.saCode;
                } else {
                    Toast(res.data.showMsg);
                }
            });
        },
        handleTab(type) {
            if (type === 1) {
                this.$refs.swipeWrapper.next();
            } else {
                this.$refs.swipeWrapper.prev();
            }
        },
        refresh() {
            clearTimeout(this.refreshTimer);
            clearInterval(this.validTimers);
            this.count = 300;
            this.qrCodeCreate();
        },
        back() {
            this.$router.go(-1);
        }
    },
    components: {
        navBar
    },
    // 清除计时器
    beforeDestroy() {
        clearTimeout(this.refreshTimer);
        clearInterval(this.validTimers);
    }
};
</script>

<style lang="scss" scoped>
.qr-container {
    background-image: url('../assets/img/qrCode/bg.png');
    background-position: center top;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .qr {
        .qr-top {
            background: url('../assets/img/qrCode/top.png') no-repeat center top;
            background-size: cover;
            width: 346px;
            height: 403.5px;
            padding: 5px;
            .my-qr {
                position: relative;
                .text {
                    padding-top: 19px;
                    text-align: center;
                    font-size: 16px;
                    color: #0a9b8c;
                    line-height: 45px;
                    &.b {
                        color: rgba(179, 77, 32, 1);
                    }
                }
                .qr-img {
                    width: 210px;
                    height: 210px;
                    margin: 0 auto;
                    background: #bae6d8;
                    border-radius: 5px;
                    padding: 7.5px;
                    &.b {
                        background: rgba(255, 72, 2, 0.2);
                    }
                    .border {
                        border-radius: 5px;
                        border: 8px solid #ffffff;
                        img {
                            width: 100% !important;
                        }
                    }
                }
                .handle {
                    background-size: cover;
                    background-position: center top;
                    background-repeat: no-repeat;
                    width: 11px;
                    height: 16px;
                    position: absolute;
                    top: 50%;
                    margin-top: -8px;
                    &.right {
                        background-image: url('../assets/img/qrCode/right.png');
                        right: 22px;
                    }
                    &.left {
                        background-image: url('../assets/img/qrCode/left.png');
                        left: 22px;
                    }
                }
            }

            .head {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                width: 336px;
                height: 60px;
                border-bottom: 1px solid #dcddde;
                .title {
                    position: relative;
                    width: 220px;
                    text-align: center;
                    font-size: 15px;
                    color: #919599;
                    line-height: 60px;
                    &::before {
                        content: '';
                        position: absolute;
                        top: 18.5px;
                        right: 0;
                        width: 1px;
                        height: 23px;
                        background: #dcddde;
                    }
                    p {
                        span {
                            margin: 1px;
                            width: 18px;
                            height: 18px;
                            padding: 1px 0;
                            display: inline-block;
                            background: #7b8085;
                            text-align: center;
                            line-height: 18px;
                            border-radius: 1.5px;
                            font-size: 14px;
                            color: #ffffff;
                            &.none {
                                background: transparent;
                                color: #7b8085;
                                margin: 0 1px;
                                padding: 0;
                                width: auto;
                            }
                        }
                    }
                }
                .btn {
                    background-image: linear-gradient(
                        90deg,
                        #00b07e 0%,
                        #0a9c70 99%
                    );
                    margin-left: 20px;
                    border-radius: 24px;
                    width: 75px;
                    height: 26px;
                    font-size: 13px;
                    color: #ffffff;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .qr-bot {
            background: url('../assets/img/qrCode/bottom.png') no-repeat center
                top;
            background-size: cover;
            margin-top: -1px;
            width: 346px;
            height: 100px;
            text-align: center;
            font-size: 16px;
            color: #b34d20;
            line-height: 100px;
        }
    }
}

/deep/.mint-swipe {
    height: 343px;
    width: 335px;
    .mint-swipe-indicators {
        bottom: 38px;
    }
    .mint-swipe-indicator {
        width: 22px;
        height: 3px;
        background: #e0f4f1;
        border-radius: 3px;
        &.is-active {
            background: #70a59e;
        }
    }
}
</style>
