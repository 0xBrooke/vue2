<template>
    <div class="content">
        <nav-bar :title="title" @back="goBack"></nav-bar>
        <div v-html="content"></div>
    </div>
</template>
<script>
import NavBar from '@/components/common/navBar.vue';
export default {
    data() {
        return {
            title: '',
            content: ''
        };
    },
    components: {
        NavBar
    },
    mounted() {
        this.title = this.$route.query.title;
        const agreementType = this.$route.query.agreementType;
        this.$api('/sm-api/agreement/queryAgreementPreview', {
            userId: this.$store.state.userInfo.personNo,
            agreementType: agreementType
        }).then(res => {
            if (res.code === 0) {
                this.content =
                    res.data.agreementContent || '没有获取到协议内容';
            }
        });
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
.content {
    // height: 100%;
    overflow: auto;
    padding-bottom: 65px;
}
</style>
