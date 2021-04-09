/* 录入成功弹框 */
<template>
    <div class="bounced">
        <div class="bounced-content">
            <img src="@/assets/img/applyList/success.png" alt="" />
            <span>操作成功</span>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
/* 弹框 */
.bounced {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    .bounced-content {
        z-index: 999;
        background: #fcfcfc;
        border-radius: 10px;
        width: 270px;
        height: 201.5px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 40px 0 47px;
        img {
            width: 69px;
            height: 77px;
        }
        span {
            font-family: PingFangSC-Regular;
            font-size: 15px;
            color: #262c32;
            letter-spacing: 0;
            line-height: 22px;
        }
    }
}
</style>
