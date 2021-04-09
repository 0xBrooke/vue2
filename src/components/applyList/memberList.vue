<!--进件中-->
<template>
    <div class="memberList">
        <div class="nav-bar" v-if="!dataInfo">
            <img src="@/assets/img/applyList/icon.png" alt="" />
            <div class="nav-item">
                进件中:
                <span>{{ count }}</span>
            </div>
        </div>
        <section
            class="base-uppack"
            v-for="(member, index) in lists"
            :key="index"
        >
            <div class="uppack-title">
                {{ member.userName }}
            </div>

            <div class="num-time-cont">
                <div class="num-time clearfix">
                    <span>{{ phoneFilter(member.mobile) }}</span>
                    <small>{{ member.createdAt }}</small>
                </div>
                <p class="grade_num">
                    编码：
                    <span>{{ member.applyNo }}</span>
                </p>
            </div>
            <div class="uppack-footer">
                <button class="cancel btn" @click="importCancel(member, index)">
                    取消
                </button>
                <button class="continue btn" @click="importContinue(member)">
                    继续办理
                </button>
            </div>
        </section>
        <btn-start :missionStart="missionStart" :footerTitle="footerTitle" />

        <!-- 无数据状态 -->
        <no-data v-if="dataInfo" />

        <!-- 底部弹框 -->
        <mt-popup class="popupWrapper" v-model="popupVisible" position="bottom">
            <div class="dialog-header">
                <span></span>
                <p>请选择</p>
                <img
                    src="@/assets/img/applyList/close.png"
                    alt="close"
                    @click="popupVisible = false"
                />
            </div>
            <div class="popup-btn">
                <div class="btn-item" @click="getCodeConfirm">
                    <div class="btn-item-left">
                        <img
                            class="btn-item-icon"
                            src="@/assets/img/applyList/scanning.png"
                            alt=""
                        />
                        <span class="btn-item-text">扫描二维码/条形码</span>
                    </div>
                    <img
                        class="btn-item-right"
                        src="@/assets/img/applyList/jump.png"
                        alt=""
                    />
                </div>

                <div class="btn-item" @click="goQrInput">
                    <div class="btn-item-left">
                        <img
                            class="btn-item-icon"
                            src="@/assets/img/applyList/input.png"
                            alt=""
                        />
                        <span class="btn-item-text">手动输入条形码</span>
                    </div>
                    <img
                        class="btn-item-right"
                        src="@/assets/img/applyList/jump.png"
                        alt=""
                    />
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { strFilter } from '@/assets/js/utils.js';
import noData from '@/components/applyList/noData.vue';
import btnStart from '@/components/applyList/btnStart.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';
const ModalHelper = (() => {
    return {
        afterOpen: function() {
            let appSt = document.getElementById('app');
            appSt.style.position = 'fixed';
        },
        beforeClose: function() {
            let appSt = document.getElementById('app');
            appSt.style.position = 'static';
        }
    };
})();

export default {
    data() {
        return {
            footerTitle: '开始进件',
            lists: [],
            count: 0,
            dataInfo: false,
            popupVisible: false
        };
    },
    created() {},
    destroyed() {
        MessageBox.close(false);
    },

    methods: {
        /* 处理手机号 */
        phoneFilter(val) {
            return strFilter(val);
        },
        /* 获取列表数据 */
        getList() {
            const params = {
                businessType: 'MYFEN',
                SACode: this.$store.state.userInfo.personNo
            };

            // applyProgress  0 商户页   1 商品分期信息  2 其他信息  3 -- 继续进件-进件详情   不是继续进件-复核
            //     4 拍照上传
            this.$api('/sm-api/applyingList', params).then(res => {
                if (res.data.code === 0) {
                    this.lists = res.data.data.list;
                    this.count = res.data.data.count;
                    if (res.data.data.list.length === 0) {
                        this.dataInfo = !this.dataInfo;
                    }
                } else {
                    Toast(res.data.showMsg);
                }
            });
        },
        /* 点击取消按钮 */
        importCancel(item) {
            /* 取消弹框 */
            MessageBox({
                title: '',
                message: '您是否确定取消进件?',
                showCancelButton: true,
                confirmButtonText: '取消进件',
                cancelButtonText: '暂不取消',
                confirmButtonClass: 'confirmButton',
                cancelButtonClass: 'cancelButton'
            }).then(action => {
                if (action === 'confirm') {
                    /* 取消进件 */
                    this.chooseConfirm(item);
                }
            });
        },
        /* 取消进件 */
        chooseConfirm(item) {
            //处理取消进件流程
            const data = {
                loanApplyNo: item.applyNo, //贷款申请编号
                SACode: this.$store.state.userInfo.personNo, //SA编码
                SAName: null, //SA名称
                SAMobile: null, //SA手机号
                applyState: '6'
            };
            this.$api('/sm-api/hasScanSuccess', data).then(res => {
                if (res.code === 0) {
                    this.getList();
                } else {
                    Toast(res.showMsg);
                }
            });
        },

        /* 点击继续办理 */
        async importContinue(_member) {
            // applyProgress  0 商户页   1 商品分期信息  2 其他信息  3 -- 继续进件-进件详情   不是继续进件-复核
            //     4 拍照上传
            this.$store.dispatch('setMember', _member);
            sessionStorage.setItem('member', JSON.stringify(_member));

            switch (_member.applyProgress) {
                case '0':
                    this.getContinueHandle(_member);
                    break;
                case '1':
                    this.$router.push({
                        name: 'Goods'
                    });
                    break;
                case '2':
                    this.$router.push({
                        name: 'Goods'
                    });
                    break;
                case '3':
                    this.$router.push({
                        name: 'Review'
                    });
                    break;
                case '4':
                    this.$router.push({
                        name: 'CustomerFace'
                    });
                    break;
            }
        },

        /* 继续办理进入渠道页扫码基础信息反显接口 */
        getContinueHandle(_member) {
            const data = {
                loanApplyNo: _member.applyNo,
                SAName: this.$store.state.userInfo.employeeName,
                SAMobile: this.$store.state.userInfo.employeeMobile,
                SACode: this.$store.state.userInfo.personNo,
                businessType: 'MYFEN'
            };
            this.$api('/sm-api/continueHandle', data).then(res => {
                if (res.code === 0) {
                    this.getHasScanSuccessCon(res.data);
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 扫码成功--扫描*/
        getHasScanSuccessCon(item) {
            const data = {
                loanApplyNo: item.applyNo,
                SACode: this.$store.state.userInfo.personNo,
                SAName: this.$store.state.userInfo.employeeName,
                SAMobile: this.$store.state.userInfo.employeeMobile,
                applyState: '2'
            };
            this.$api('/sm-api/hasScanSuccess', data).then(res => {
                if (res.code === 0) {
                    item.receiverName = res.data.receiverName; // 受理人
                    sessionStorage.setItem('member', JSON.stringify(item));
                    this.$store.dispatch('setMember', item);
                    this.$router.push({
                        name: 'MerchantsChoose'
                    });
                } else {
                    Toast(res.showMsg);
                }
            });
        },

        /* 开始进件 逻辑处理 */
        missionStart() {
            this.popupVisible = true; //弹框
        },

        /* 手动输入条形码 */
        goQrInput() {
            this.popupVisible = false;
            setTimeout(() => {
                this.$router.replace({
                    name: 'QrInput'
                });
            }, 0);
        },

        /* 获取二维码信息 */
        getCodeConfirm() {
            /* 效验相机权限 */
            YK_JSBridge.getOnlineDeviceAuthorizationStatus(
                res => {
                    /* 未授权手动录入信息 */
                    if (res.status !== 'authorized') {
                        /* 没有权限 */
                        Toast('请在设置中开启摄像头权限');
                        return;
                    }
                    this.getLocation();
                },
                err => {
                    console.log(err, '相机权限-err');
                },
                'camera'
            );
        },
        /* 效验定位权限 */
        getLocation() {
            /* 效验定位权限 */
            YK_JSBridge.getOnlineDeviceAuthorizationStatus(
                res => {
                    /* 未授权手动录入信息 */
                    if (res.status !== 'authorized') {
                        /* 没有权限 */
                        Toast('请在设置中开启GPS权限');
                        return;
                    }
                    this.getScan();
                },
                err => {
                    console.log(err, 'err--getLocation');
                },
                'location'
            );
        },
        /* 扫一扫 */
        getScan() {
            this.popupVisible = false;
            /* 调起桥接 -- 调起扫一扫 */
            YK_JSBridge.callScanComp(
                res => {
                    if (res.indexOf('GMLOC') === -1) {
                        Toast('请扫描正确的二维码');
                        return;
                    }
                    let result = res.replace(/\s+/g, '');
                    this.getHasOrder(result);
                },
                err => {
                    console.log(err);
                }
            );
        },
        /* 获取gps */
        async getPosition() {
            const pos = await YK_JSBridge.getLocation();
            return pos.data;
        },
        /* 扫描二维码查询客户信息 */
        async getHasOrder(applyNo) {
            const pos = await this.getPosition();
            if (pos && pos.latitude !== '') {
                const data = {
                    loanApplyNo: applyNo,
                    businessType: 'MYFEN',
                    saLnt: pos.longitude,
                    saLat: pos.latitude,
                    SAName: this.$store.state.userInfo.employeeName,
                    SACode: this.$store.state.userInfo.personNo,
                    SAMobile: this.$store.state.userInfo.employeeMobile
                };
                this.$api('/sm-api/hasOrder', data).then(res => {
                    if (res.code === 0) {
                        /* 通知美易分扫码成功 */
                        this.getHasScanSuccess(res.data);
                    } else {
                        Toast(res.showMsg);
                    }
                });
            } else {
                Toast('用户经纬度、周边距离不能为空');
            }
        },
        /* 扫码成功--扫描*/
        getHasScanSuccess(item) {
            if (
                item.businessType === item.productType &&
                item.applyState === '0'
            ) {
                const data = {
                    loanApplyNo: item.applyNo,
                    SACode: this.$store.state.userInfo.personNo,
                    SAName: this.$store.state.userInfo.employeeName,
                    SAMobile: this.$store.state.userInfo.employeeMobile,
                    applyState: '2'
                };
                this.$api('/sm-api/hasScanSuccess', data).then(res => {
                    if (res.code === 0) {
                        item.receiverName = res.data.receiverName; // 受理人
                        sessionStorage.setItem('member', JSON.stringify(item));
                        this.$store.dispatch('setMember', item);
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
    watch: {
        popupVisible(newVal) {
            if (newVal) {
                ModalHelper.afterOpen();
            } else {
                ModalHelper.beforeClose();
            }
        }
    },
    mounted() {
        this.$store.dispatch('setIsModify', false);
        this.$store.dispatch('setIsOther', true);
        sessionStorage.setItem('fromReview', 0);
        this.$store.dispatch('setKeepAlive', []); //设置缓存

        this.getList();
    },
    deactivated() {
        //清除keep-alive的缓存
        this.$destroy(true);
    },

    components: {
        noData,
        btnStart
    }
};
</script>
<style lang="scss">
/* 取消弹框的样式 */
.cancelButton {
    font-size: 16px;
    color: #7a7f85;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.confirmButton {
    font-size: 16px;
    color: #0a9c70;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.mint-popup {
    border-radius: 5px 5px 0 0;
}
.mint-msgbox-message {
    font-size: 15px;
    color: #262c32;
    letter-spacing: 0;
    text-align: center;
    // line-height: 74.5px;
}
.mint-msgbox {
    width: 71%;
    border-radius: 10px;
}
.memberList::-webkit-scrollbar {
    display: none;
}
</style>

<style lang="scss" scoped>
.clearfix:after {
    display: block;
    content: ' ';
    clear: both;
    font-size: 0;
    visibility: hidden;
}
.memberList {
    background-color: #f3f5f7;
    overflow: auto;
    width: 100%;
    padding-bottom: 65px;
    .nav-bar {
        margin: 0 15px;
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
            width: 13.2px;
            height: 16.8px;
        }
        .nav-item {
            margin-left: 5.4px;
            font-size: 14px;
            color: #262626;
            font-weight: 400;
            span {
                font-weight: 600;
                font-size: 16px;
                color: #ff4800;
            }
        }
    }

    .base-uppack {
        background-color: #fff;
        padding: 0 15px;
        margin: 0 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        .base-uppack:last-child {
            margin-bottom: 200px !important;
        }
        .uppack-title {
            padding: 19.5px 0 13.5px;
            font-size: 14px;
            font-family: PingFangHK-Medium, PingFangHK;
            font-weight: bold;
            color: #262c32;
            line-height: 14px;
        }

        .num-time-cont {
            .num-time {
                font-size: 14px;
                color: #5a6066;
                line-height: 12px;
                span {
                    float: left;
                }
                small {
                    float: right;
                }
            }

            .grade_num {
                padding: 13px 0 21px;
                font-size: 12px;
                color: #7a7f85;
                line-height: 11px;
            }
            &:after {
                display: block;
                box-sizing: border-box;
                content: ' ';
                width: 100%;
                height: 1px;
                background-color: #dedede;
                transform: scaleY(0.5);
            }
        }
        .uppack-footer {
            padding: 9px 0 7px;
            text-align: right;
            .btn {
                width: 75px;
                height: 28px;
                border-radius: 14px;
                line-height: 28px;
                text-align: center;
                font-size: 12px;
            }
            .cancel {
                border: 1px solid #dedede;
                background-color: #fff;
                color: #5a6066;
                margin-right: 10px;
            }
            .continue {
                color: #fff;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
    }
    /* 弹框 */
    .popupWrapper {
        width: 100%;
        height: 300px;
        background-color: #fff;
        margin: 0;
        .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 60px;
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
        .popup-btn {
            margin: 8px 0 0;
            .btn-item {
                margin: 0 20px;
                height: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                .btn-item-left {
                    display: flex;
                    align-items: center;
                    .btn-item-icon {
                        width: 17px;
                        height: 17px;
                    }
                    .btn-item-text {
                        margin-left: 10px;
                        font-size: 16px;
                        color: #262c32;
                        letter-spacing: 0.305px;
                        text-align: left;
                        line-height: 16px;
                    }
                }

                .btn-item-right {
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
}
</style>
