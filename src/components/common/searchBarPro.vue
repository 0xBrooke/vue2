<template>
    <div class="search-bar">
        <span class="search-bar-icon"></span>
        <input
            type="text"
            class="search-bar-input"
            placeholder="请输入推广员姓名/手机号/工号"
            v-model.trim="keyword"
            @focus="showOrg"
        />
        <span class="search-bar-search" @click="search">搜索</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            keyword: ''
        };
    },
    methods: {
        search() {
            this.$emit('on-search', this.keyword);
        },
        showOrg() {
            this.$emit('show-org');
        }
    }
};
</script>

<style lang="scss" scoped>
.search-bar {
    position: relative;
    width: 100%;
    padding: 11px 0px 11px 15px;
    background: #fff;
    height: 50px;
    z-index: 99;
    &-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        position: absolute;
        top: 18px;
        left: 25px;
        background: url('../../assets/img/customer/search-icon.png') no-repeat
            center;
        background-size: 14px;
    }
    &-input {
        width: 294px;
        height: 30px;
        background: #f3f5f7;
        border-radius: 15px;
        border: none;
        padding-left: 30px;
        font-size: 14px;
        line-height: 20px;
        caret-color: #0a9c70;
    }
    &-search {
        font-size: 14px;
        color: #0a9c70;
        width: 28px;
        padding-left: 18px;
    }
}
input::placeholder {
    color: #b3b8bd;
}
</style>
