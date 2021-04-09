<template>
    <div>
        <nav-bar title="客户管理" @back="back"></nav-bar>
        <div class="container">
            <div class="header">
                <div>
                    <search-bar @on-search="searchCustomer"></search-bar>
                </div>
                <div class="showPop" @click="showPop">
                    筛选
                </div>
            </div>
            <!-- 筛选弹窗 -->
            <popup ref="popupScreen" @closePop="getPopV"></popup>
            <div class="customerContent">
                <div
                    class="list"
                    v-for="(v, i) in customerList"
                    :key="i"
                    @click="toInfo(v.cCustomerId)"
                >
                    <p>{{ v.name }}</p>
                    <span>
                        {{ v.cellphone | changePhone }}
                    </span>
                </div>
            </div>
            <!-- 暂无客户 -->
            <div v-if="customerList.length === 0 && name === ''">
                <none-customer></none-customer>
            </div>
            <!-- 无搜索结果 -->
            <div
                class="searchV"
                v-if="customerList.length === 0 && name !== ''"
            >
                <span>暂未搜到相关内容</span>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import SearchBar from '@/components/common/searchBar.vue';
import Popup from '@/components/customer/popup.vue';
import NoneCustomer from '@/components/customer/noneCustomer.vue';
import { idNoFormat } from '@/assets/js/utils.js';
export default {
    components: {
        NavBar,
        SearchBar,
        Popup,
        NoneCustomer
    },
    data() {
        return {
            value: '',
            customerList: '',
            curPagerNo: 1, //当前页数
            pageSize: 100000, // 每页条数
            name: '',
            statuses: '', //逾期
            regularCustomer: '' //老客户
        };
    },
    created() {
        this.getDataList();
    },
    methods: {
        back() {
            this.$router.push('/index');
        },
        showPop() {
            // this.popupVisible = true;
            this.$refs.popupScreen.popupVisible = true;
        },
        searchCustomer(keyword) {
            this.name = keyword;
            this.getDataList();
        },
        //获取客户列表
        getDataList() {
            const data = {
                saCode: this.$store.state.userInfo.personNo,
                pageSize: this.pageSize, //pageSize,  每页条数
                curPagerNo: this.curPagerNo, //curPagerNo  当前页数
                name: this.name,
                statuses: this.statuses,
                regularCustomer: this.regularCustomer
            };
            this.$api('/sm-api/customerList', data).then(res => {
                if (res.data.code === 0) {
                    this.customerList = res.data.data;
                }
            });
        },
        toInfo(userId) {
            this.$router.push(`/consumerInfomation?userId=${userId}`);
        },
        getPopV(res) {
            this.$refs.popupScreen.popupVisible = false;
            this.statuses = res.statuses;
            this.regularCustomer = res.regularCustomer;
            this.getDataList();
        }
    },
    filters: {
        changePhone(tel) {
            return idNoFormat(tel);
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: auto;
    position: fixed;
    .header {
        background: #fff;
        position: fixed;
        width: 100%;
        border-bottom: solid 1px #ebeced;
    }
}
.showPop {
    font-family: PingFang-SC-Bold;
    font-size: 12px;
    color: #0a9c70;
    position: absolute;
    right: 15px;
    top: 16px;
    padding-left: 15px;
    border-left: solid 1px #dedede;
}
.customerContent {
    width: 100%;
    margin-top: 70px;
    padding-bottom: 50px;
    .list {
        margin: 20px;
        padding-bottom: 20px;
        border-bottom: solid 1px #ebeced;
        p {
            font-family: PingFangHK-Regular;
            line-height: 14px;
            font-size: 16px;
            font-weight: 550;
            color: #262c32;
            margin-bottom: 10px;
        }
        span {
            font-size: 16px;
            font-family: PingFangSC-Regular;
            color: #5a6066;
        }
    }
}
.searchV {
    width: 200px;
    height: 115px;
    background: url('../assets/img/customer/noneCustomer.png') no-repeat;
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
        left: 35px;
    }
}
</style>
