<template>
    <div class="mes">
        <h4>子组件:{{ text }}</h4>
        <p>加：{{ number }}</p>
        <button type="button" class="button" @click="plus">子改子</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            number: 0
        };
    },
    props: {
        text: {
            type: String,
            default: ''
        }
    },
    methods: {
        plus() {
            this.number += 1;
        }
    },
    beforeCreate() {
        console.log('子组件>beforeCreate');
    },
    created() {
        console.log('子组件>create');
    },
    beforeMount() {
        console.log('子组件>beforMount');
    },
    mounted() {
        console.log('子组件>mounted');
    },
    beforeUpdate() {
        console.log('子组件>beforeUpdate');
    },
    updated() {
        console.log('子组件>updated');
    },
    activated() {
        console.log('子组件>activated');
    },
    deactivated() {
        console.log('子组件>deactivated');
    },
    beforeDestroy() {
        console.log('子组件>beforeDestroy');
    },
    destroy() {
        console.log('子组件>destroy');
    }
};
</script>
<style lang="scss" scoped>
.button {
    padding: 5px 10px;
    background: rgb(57, 189, 90);
}
</style>
