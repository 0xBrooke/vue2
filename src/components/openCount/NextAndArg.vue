<template>
    <div class="next-wrapper">
        <div class="argSignDesc">
            <span>点击下一步即表示您同意</span>
            <span class="argList" @click="getArgList">实名及绑卡相关协议</span>
        </div>
        <div class="btn-box">
            <button
                class="nextStep"
                :disabled="hasRealInfo"
                @click="bindCardNextStep"
            >
                下一步
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {};
    },
    props: {
        hasRealInfo: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getArgList() {
            this.$emit('getArgList');
        },
        bindCardNextStep() {
            this.$emit('nextStep');
        }
    }
};
</script>

<style lang="scss" scoped>
.next-wrapper {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 30px;
    margin: 0 auto;
    .argSignDesc {
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 18px;
        .argList {
            color: #0a9c70;
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
            background: #0a9c70;
            border-radius: 22.5px;
            color: #fff;
            font-size: 16px;
            &:disabled {
                background: #4dc6a4;
                color: rgba(255, 255, 255, 0.6);
            }
        }
        .noApply {
            margin-top: 18px;
            font-size: 13px;
            color: #1e86ff;
        }
    }
}
</style>
