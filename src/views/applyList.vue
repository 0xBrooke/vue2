<template>
    <div class="apply-list">
        <nav-bar title="国美分期" @back="back"></nav-bar>
        <member-list />
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import MemberList from '@/components/applyList/memberList.vue';

export default {
    name: '',
    data() {
        return {
            defaultFront: '',
            defaultBack: '',
            dataList: false,
            phone: ''
        };
    },
    created() {},
    methods: {
        back() {
            this.$router.replace({
                name: 'Index'
            });
        }
    },
    mounted() {},
    components: {
        NavBar,
        MemberList
    }
};
</script>
<style lang="scss" scoped>
.apply-list {
    background-color: #f3f5f7;
}
</style>
