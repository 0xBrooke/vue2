<template>
    <div class="select-env">
        <p class="value" @click="showList = !showList">
            {{ envStr.replace(/yknew-/, '') }}
        </p>
        <ul v-show="showList">
            <li
                v-for="(item, index) in envArr"
                @click="selEnv(item)"
                :key="index"
            >
                {{ item.replace(/yknew-/, '') }}
            </li>
        </ul>
    </div>
</template>

<script>
import { ENVARRAY } from 'assets/js/request';
import { device } from 'assets/js/utils';

export default {
    data() {
        return {
            showList: false,
            envArr: ENVARRAY,
            envStr: localStorage.getItem('env') || ENVARRAY[0] // 默认10.163.0.33:49000环境
        };
    },
    methods: {
        selEnv(item) {
            localStorage.setItem('env', item);
            this.pageReload();
        },
        pageReload() {
            if (device.isWeixin()) {
                this.$router.push({
                    query: {
                        ...this.$route.query,
                        timestr: new Date().getTime()
                    }
                });
            }
            window.location.reload();
        }
    }
};
</script>

<style lang="scss" scoped>
.select-env {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9;
    width: 80px;
    text-align: right;
    font-size: 12px;
    p {
        text-align: center;
        opacity: 0.4;
        color: red;
    }
    li {
        background: yellow;
        margin-top: 10px;
        color: red;
        border-radius: 10px;
        text-align: center;
    }
}
</style>
