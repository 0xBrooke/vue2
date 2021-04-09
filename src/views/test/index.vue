<template>
    <div>
        <div>
            <h4>父组件</h4>
            <p>减：{{ number }}</p>
            <button type="button" class="btn" @click="Reduce1">
                父改父减1
            </button>
            <button type="button" class="btn" @click="Reduce2">父改子</button>
        </div>
        <keep-alive>
            <message :text="message" ref="Msg" v-if="show"></message>
        </keep-alive>
        <button type="button" class="btn" @click="goIndex">调转页面</button>
    </div>
</template>
<script>
import Message from './components/message';
export default {
    data() {
        return {
            number: 10,
            message: '默认值',
            show: true
        };
    },
    components: {
        Message
    },
    methods: {
        Reduce1() {
            this.number -= 1;
        },
        Reduce2() {
            this.message = '父传子';
        },
        goIndex() {
            this.show = false;
        }
    },
    beforeCreate() {
        console.log('父组件>beforeCreate');
    },
    created() {
        console.log('父组件>created');
    },
    beforeMount() {
        console.log('父组件>beforMount');
    },
    mounted() {
        console.log('父组件>mounted');
    },
    beforeUpdate() {
        console.log('父组件>beforeUpdate');
    },
    updated() {
        console.log('父组件>updated');
    },
    activated() {
        console.log('父组件>activated');
    },
    deactivated() {
        console.log('父组件>deactivated');
    },
    beforeDestroy() {
        console.log('父组件>beforeDestroy');
    },
    destroy() {
        console.log('父组件>destroy');
    }
};
</script>
<style lang="scss" scoped>
.btn {
    padding: 5px 10px;
    background: rgb(57, 189, 90);
    margin-right: 3px;
}
</style>
