<template>
    <!-- 底部弹框 -分期费率-->
    <mt-popup
        class="popupWrapper"
        v-model="stagingRate"
        @touchmove.prevent
        position="bottom"
        closeOnClickModal
    >
        <div class="pop-header">
            <div class="outside"></div>
            <p>分期费率</p>
            <div class="outside">
                <img
                    src="@/assets/img/applyList/close.png"
                    alt="close"
                    @click="stagingRate = false"
                />
            </div>
        </div>
        <div class="popup-item">
            <div
                class="btn-item"
                v-for="(item, index) in productList"
                :key="index"
                @click="chooseStagingRate(item, index)"
            >
                <div
                    class="btn-item-text"
                    :class="{
                        isActive: currentStagingRateIndex === index
                    }"
                >
                    {{ item.promotionRate }}
                    <img
                        v-if="currentStagingRateIndex === index"
                        src="@/assets/img/applyList/selected.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
    </mt-popup>
</template>

<script>
export default {
    props: {
        stagingRate: Boolean, //分期费率弹框
        productList: Array // 分期费率获取的所有数据
    },
    data() {
        return {
            /*  分期费率*/
            currentStagingRateIndex: '' // 分期费率下标
        };
    },
    watch: {
        stagingRate(newVal) {
            this.$emit('stagingRates', newVal);
        }
    },
    methods: {
        /* 选择分期费率 */
        chooseStagingRate(item, index) {
            this.$emit('chooseStagingRate', item, index);
            this.currentStagingRateIndex = index;
        }
    }
};
</script>

<style lang="scss" scoped>
/* 弹框 */
.popupWrapper {
    width: 100%;
    height: 300px;
    background-color: #fff;
    margin: 0;
    .pop-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 60px;
        background: #f9fafb;
        border-radius: 5px 5px 0 0;
        padding: 0 15px;
        .outside {
            width: 15px;
        }
        p {
            font-size: 18px;
            color: #262c32;
            letter-spacing: 0;
            text-align: center;
            line-height: 15px;
        }
        img {
            width: 15px;
            height: 15px;
            float: left;
        }
    }
    .popup-item {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        margin: 8px 0 0;
        .btn-item {
            margin: 0 20px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            // border-bottom: 1px solid #dedede;
            position: relative;
            .btn-item-text {
                font-size: 16px;
                color: #262c32;
                letter-spacing: 0.305px;
                line-height: 16px;
                margin-right: 5px;
                position: relative;
                img {
                    position: absolute;
                    top: 2.5px;
                    right: -20px;
                    width: 15.7px;
                    height: 10.6px;
                }
            }
            .isActive {
                color: #0a9c70;
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
    .popup-btn {
        width: 320px;
        height: 45px;
        margin: 33px 22.5px 25px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 22.5px;
        font-size: 16px;
        color: #fff;
        text-align: center;
    }
}
</style>
