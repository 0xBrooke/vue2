<template>
    <div id="app">
        <keep-alive :include="keepAlive">
            <router-view />
        </keep-alive>
        <!-- <router-view v-if="!$route.meta.keepAlive" /> -->
        <!-- <select-env v-if="showEnvSel" /> -->
        <div class="mask" v-if="loading">
            <mt-spinner :type="3" color="#0A9C70" class="loading"></mt-spinner>
        </div>
    </div>
</template>

<script>
import '@/assets/scss/common.scss';
// import selectEnv from '@/components/common/selectEnv.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';

export default {
    name: 'app',
    computed: {
        // showEnvSel() {
        //     return process.env.NODE_ENV === 'development';
        // },
        keepAlive() {
            return this.$store.getters.keepAlive;
        },
        loading() {
            return this.$store.state.showLoading;
        }
    },
    components: {
        // selectEnv
    },
    created() {
        // 隐藏原生导航头
        YK_JSBridge.hideHeadBar();
        //在页面加载时读取sessionStorage里的状态信息
        if (sessionStorage.getItem('store')) {
            this.$store.replaceState(
                Object.assign(
                    {},
                    this.$store.state,
                    JSON.parse(sessionStorage.getItem('store'))
                )
            );
            sessionStorage.removeItem('store');
        }
        //在页面刷新时将vuex里的信息保存到sessionStorage里
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('store', JSON.stringify(this.$store.state));
        });
    }
};
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    padding-top: 44px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    > div {
        height: calc(100vh-44px);
        height: calc(
            100vh - 44px - constant(safe-area-inset-top)-constant(
                    safe-area-inset-bottom
                )
        );
        height: calc(
            100vh - 44px - env(safe-area-inset-top)-env(safe-area-inset-bottom)
        );
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        display: flex;
        z-index: 10000;
        .loading {
            margin: auto;
        }
    }
    &.active {
        pointer-events: none;
    }
    input {
        user-select: auto;
        -webkit-user-select: auto;
    }
}
// 全局组件toast样式重置
.mint-toast {
    z-index: 2999 !important;
}
.mint-popup {
    border-radius: 5px 5px 0 0;
}
.mint-msgbox-content {
    padding-top: 25px !important;
    padding-bottom: 25px !important;
}
.mint-msgbox-message {
    line-height: 20px !important;
}
.mint-msgbox-header {
    padding-top: 25px !important;
}
// @supports (bottom: env(safe-area-inset-bottom)) {
//     body,
//     .footer {
//         padding-bottom: constant(safe-area-inset-bottom);
//         padding-bottom: env(safe-area-inset-bottom);
//     }
// }

body {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
@supports (
        (height: constant(safe-area-inset-top)) or
            (height: env(safe-area-inset-top))
    )
    and (-webkit-overflow-scrolling: touch) {
    .fullscreen {
        /* 适配齐刘海 */
        // padding-top: constant(safe-area-inset-top);
        // padding-top: env(safe-area-inset-top);

        /* 适配底部小黑条 */
        padding-bottom: costant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
}
</style>
