<!--暂无数据页-->
<template>
    <div class="no-data">
        <img :src="noData" />
        <p>为了业绩赶快去进件吧!</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            noData: require('@/assets/img/applyList/no-data.png')
        };
    },
    components: {}
};
</script>
<style lang="scss">
.no-data {
    width: 199.5px;
    margin: 0 auto;
    > img {
        width: 199.5px;
        height: 124px;
        display: block;
        margin: 125px auto 25.5px;
    }
    p {
        text-align: center;
        font-size: 16px;
        color: #5a6066;
        line-height: 14px;
    }
}
</style>
