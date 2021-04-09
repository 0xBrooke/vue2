<template>
    <div class="search-bar">
        <span class="search-bar-icon"></span>
        <input
            type="text"
            class="search-bar-input"
            placeholder="请输入姓名/手机号"
            v-model.trim="keyword"
        />
        <button class="search-bar-submit" @click="search">搜索</button>
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
    &-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        position: absolute;
        top: 19px;
        left: 25px;
        background: url('../../assets/img/customer/search-icon.png') no-repeat
            center;
        background-size: 14px 14px;
    }
    &-input {
        width: 251px;
        height: 30px;
        background: #f3f5f7;
        border-radius: 15px;
        border: none;
        padding-left: 30px;
        font-size: 14px;
        line-height: 20px;
        caret-color: #0a9c70;
    }
    &-submit {
        position: absolute;
        top: 16px;
        right: 70px;
        border: none;
        background: none;
        color: #333;
        font-size: 12px;
    }
}
</style>
