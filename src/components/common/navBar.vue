<template>
    <div class="header">
        <div class="content-nav">
            <div class="back" @click="goBack">
                <img src="@/assets/img/common/back.png" alt="" />
            </div>
            <div class="title">{{ title }}</div>
            <div class="search" v-if="searchVisible" @click="search">
                click me
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        searchVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        goBack() {
            this.$emit('back');
        },
        search() {
            this.$emit('search');
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: calc(44px + constant(safe-area-inset-top));
    height: calc(44px + env(safe-area-inset-top));
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    background: #ffffff;
    border-bottom: 1px solid #f4f5f7;
    top: 0;
    .content-nav {
        position: relative;
        display: flex;
        align-items: center;
    }
    .back {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        img {
            width: 12px;
            height: 20px;
            margin-left: 12px;
        }
    }
    .title {
        font-size: 18px;
        color: #333333;
        text-align: center;
        line-height: 44px;
        flex: 1;
        text-align: center;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }
    .search {
        position: absolute;
        right: 17.5px;
        bottom: 9px;
    }
}
</style>
