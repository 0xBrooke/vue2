<template>
    <div>
        <nav-bar title="推广员信息" @back="back"></nav-bar>
        <div>
            <search-bar-pro @on-search="searchCustomer"></search-bar-pro>
        </div>
        <div class="promoterList" ref="promoterList">
            <div
                class="list"
                v-for="(item, index) in employeeList"
                :key="index"
                @click="toInfo(index)"
            >
                <p>
                    <span>
                        {{ item.employeeName }}（{{ item.employeeId }}）
                    </span>
                </p>
                <div>
                    <span>{{ item.employeeMobile | changePhone }}</span>
                </div>
            </div>
            <div class="add" @click="add" v-if="hideshow">
                <span>添加推广员</span>
            </div>
            <div class="load-more" v-if="hasMore">
                <span>加载中……</span>
            </div>
            <div class="load-more" v-if="loaded">
                <span>已经到底了~</span>
            </div>
            <div v-if="employeeList.length === 0">
                <none-promoter></none-promoter>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import SearchBarPro from '@/components/common/searchBarPro.vue';
import NonePromoter from '@/components/promoterInfo/nonePromoter.vue';
import debounce from 'lodash/debounce';
import { idNoFormat } from '@/assets/js/utils.js';
export default {
    components: {
        NavBar,
        SearchBarPro,
        NonePromoter
    },
    data() {
        return {
            employeeList: [],
            curPagerNo: 1,
            pageSize: 10,
            searchVal: '',
            loaded: false, // 当前页是否请求完成
            hasMore: false, // 是否还有数据
            docmHeight: document.documentElement.clientHeight, //默认屏幕高度
            showHeight: document.documentElement.clientHeight, //实时屏幕高度
            hideshow: true //显示或者隐藏footer
        };
    },
    created() {
        this.getDataList();
    },
    mounted() {
        this.$refs.promoterList.addEventListener(
            'scroll',
            debounce(this.scrollListener, 500)
        );
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight;
            })();
        };
    },
    watch: {
        showHeight: function() {
            if (this.docmHeight > this.showHeight) {
                this.hideshow = false;
            } else {
                this.hideshow = true;
            }
        }
    },
    beforeDestroy() {
        this.$refs.promoterList.removeEventListener(
            'scroll',
            this.scrollListener
        );
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        scrollListener() {
            const list = this.$refs.promoterList;
            if (
                list.scrollHeight - list.scrollTop - list.offsetHeight < 10 &&
                this.hasMore
            ) {
                this.curPagerNo++;
                this.getDataList();
            }
        },
        searchCustomer(keyword) {
            this.searchVal = keyword;
            this.loaded = false;
            this.hasMore = false;
            this.employeeList = [];
            this.getDataList();
        },
        //获取推广员列表
        getDataList() {
            let data = {};
            if (this.searchVal) {
                data = {
                    search: this.searchVal,
                    personNo: this.$store.state.userInfo.personNo,
                    pageNum: this.curPagerNo,
                    pageSize: this.pageSize
                };
            } else {
                data = {
                    personNo: this.$store.state.userInfo.personNo,
                    pageNum: this.curPagerNo,
                    pageSize: this.pageSize
                };
            }
            this.$api('/employee/queryEmployeeRelation', data).then(res => {
                if (res.resultCode === '1000') {
                    this.employeeList.push(...res.data.list);
                    this.hasMore = res.data.pages > this.curPagerNo;
                    if (res.data.pages === this.curPagerNo) {
                        this.loaded = true;
                        this.hasMore = false;
                    }
                } else {
                    Toast(res.resultMsg);
                }
            });
        },
        toInfo(index) {
            let userInfo = JSON.stringify(this.employeeList[index]);
            this.$router.push(
                `/promoterInfoList?userInfo=${encodeURIComponent(userInfo)}`
            );
        },
        add() {
            this.$router.push('/addPromoter');
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
.promoterList {
    width: 100%;
    height: calc(100vh-44px-50px);
    height: calc(
        100vh - 44px - 50px - constant(safe-area-inset-top)-constant(
                safe-area-inset-bottom
            )
    );
    height: calc(
        100vh - 44px - 50px - env(safe-area-inset-top)-env(
                safe-area-inset-bottom
            )
    );
    border-top: solid 1px #ebeced;
    overflow: auto;
    background: #fff;
    .list {
        margin: 20px;
        border-bottom: solid 1px #ebeced;
        position: relative;
        &:after {
            content: '';
            width: 6px;
            height: 12px;
            position: absolute;
            top: 18px;
            right: 0px;
            background: url('../assets/img/promoter/arrow.png') no-repeat;
            background-size: 6px 12px;
        }
        p {
            margin-bottom: 6px;
            span {
                font-family: PingFangHK-Regular;
                line-height: 14px;
                font-size: 16px;
                color: #262c32;
                font-weight: bold;
            }
        }
        div {
            margin-bottom: 15px;
            span {
                font-size: 16px;
                font-family: PingFangSC-Regular;
                color: #5a6066;
            }
        }
    }
    .add {
        width: 160px;
        height: 45px;
        border-radius: 22px;
        background: #00b07e;
        position: fixed;
        bottom: 20px;
        left: 108px;
        text-align: center;
        line-height: 45px;
        span {
            color: #fff;
            font-size: 16px;
            padding-left: 15px;
            &:before {
                content: '';
                width: 12px;
                height: 12px;
                position: absolute;
                top: 16px;
                left: 30px;
                background: url('../assets/img/promoter/add.png') no-repeat;
                background-size: 12px;
            }
        }
    }
}
.load-more {
    width: 100%;
    height: 50px;
    background: #fff;
    color: #999999;
    font-size: 12px;
    text-align: center;
    line-height: 50px;
}
</style>
