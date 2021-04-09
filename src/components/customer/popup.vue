<template>
    <div>
        <mt-popup
            v-model="popupVisible"
            position="right"
            class="mint-popup-right"
        >
            <div class="title" :class="ua === true ? 'uaIos' : ''">
                <p>客户类型</p>
                <div
                    :class="statusFlag === true ? 'btnActive' : 'btn'"
                    @click="getStatuses"
                >
                    逾期客户
                </div>
            </div>
            <div class="title">
                <p>老客户列表</p>
                <div
                    :class="regularFlag === true ? 'btnActive' : 'btn'"
                    @click="GetRegularCustomer"
                >
                    老客户
                </div>
            </div>
            <div>
                <div class="resetBtn" @click="resetBtn">重置</div>
                <div class="sureBtn" @click="sure">确定</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
    data() {
        return {
            popupVisible: false,
            statuses: '', //逾期
            regularCustomer: '', //老客户
            statusFlag: false,
            regularFlag: false,
            ua: false
        };
    },
    mounted() {
        let UA = navigator.userAgent;
        if (UA.match(/iPad/) || UA.match(/iPhone/) || UA.match(/iPod/)) {
            this.ua = true;
        } else {
            this.ua = false;
        }
    },
    methods: {
        //点击逾期
        getStatuses() {
            this.statusFlag = !this.statusFlag;
            if (this.statusFlag === true) {
                this.statuses = '1';
            } else {
                this.statuses = '';
            }
        },
        //点击老客户
        GetRegularCustomer() {
            this.regularFlag = !this.regularFlag;
            if (this.regularFlag === true) {
                this.regularCustomer = '1';
            } else {
                this.regularCustomer = '';
            }
        },
        //重置按钮
        resetBtn() {
            this.statusFlag = false;
            this.regularFlag = false;
            this.regularCustomer = '';
            this.statuses = '';
        },
        //确定筛选
        sure() {
            this.$emit('closePop', {
                statuses: this.statuses,
                regularCustomer: this.regularCustomer
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.mint-popup-right {
    width: 290px;
    padding-top: 41px;
    height: 100vh;
    .title {
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        p {
            margin: 29px 0px 15px 15px;
            font-family: PingFangSC-Medium;
            font-size: 13px;
            color: #000000;
            font-weight: 550;
        }
    }
    .resetBtn {
        width: 125px;
        height: 35px;
        border: 1px solid #d1d1d1;
        border-radius: 18px;
        text-align: center;
        line-height: 35px;
        font-size: 13px;
        color: #2d2d2d;
        position: fixed;
        bottom: 32px;
        left: 15px;
    }
    .sureBtn {
        width: 125px;
        height: 35px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 18px;
        text-align: center;
        line-height: 35px;
        font-size: 13px;
        color: #fff;
        position: fixed;
        bottom: 32px;
        right: 15px;
    }
}
.btnActive {
    display: inline-block;
    width: 86px;
    height: 37px;
    margin: 0 0 5px 15px;
    padding: 0px 10px;
    background: rgba(10, 156, 112, 0.05);
    border: 1px solid #0a9c70;
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 37px;
    text-align: center;
    color: #0a9c70;
}
.btn {
    display: inline-block;
    width: 86px;
    height: 37px;
    margin: 0 0 5px 15px;
    padding: 0px 10px;
    border: 1px solid #dedede;
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    text-align: center;
    color: #5a6066;
    line-height: 37px;
}
.uaIos {
    padding-top: 60px;
}
</style>
