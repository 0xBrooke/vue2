<!--开始进件按钮-->
<template>
    <div class="btn-start">
        <section class="btn" @click="missionStart">
            {{ footerTitle }}
        </section>
    </div>
</template>
<style lang="scss">
.btn-start {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 65px;
    padding: 10px 27.5px;
    opacity: 0.9;
    background: #fff;
    .btn {
        width: 320px;
        height: 45px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 22.5px;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        line-height: 45px;
    }
}
</style>
<script>
export default {
    data() {
        return {};
    },
    props: {
        missionStart: Function,
        footerTitle: String
    }
};
</script>
