<template>
    <div>
        <!-- 暂无客户 -->
        <div class="noneCustomer">
            <span>暂无客户</span>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.noneCustomer {
    width: 200px;
    height: 115px;
    background: url('../../assets/img/customer/noneCustomer.png') no-repeat;
    background-size: 200px 115px;
    margin: 122px 88px 25px 88px;
    position: relative;
    span {
        font-size: 16px;
        color: #5a6066;
        font-family: PingFangSC-Regular;
        font-weight: 500;
        position: absolute;
        top: 120px;
        left: 68px;
    }
}
</style>
