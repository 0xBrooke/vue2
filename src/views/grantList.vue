<template>
    <div>
        <nav-bar title="选择推广员" @back="back"></nav-bar>
        <div>
            <search-bar-pro @on-search="searchCustomer"></search-bar-pro>
        </div>
        <div class="promoterList" ref="grantInfoList">
            <div
                class="list"
                v-for="(item, i) in employeeList"
                :key="i"
                @click="getUserInfo(i)"
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
        <mt-popup
            class="popupWrapper"
            v-model="popupVisible"
            position="bottom"
            closeOnClickModal
        >
            <div class="dialog-header">
                <p>信息确认</p>
                <img
                    src="@/assets/img/applyList/close.png"
                    alt="close"
                    @click="popupVisible = false"
                />
            </div>
            <div class="info-confirm">
                <div class="confirm-item">
                    <div class="item-type">推广员</div>
                    <div class="item-value">
                        {{ userInfo.employeeName }}
                    </div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">编号</div>
                    <div class="item-value">{{ userInfo.employeeId }}</div>
                </div>
                <div class="confirm-item">
                    <div class="item-type">手机号</div>
                    <div class="item-value">
                        {{ userInfo.employeeMobile }}
                    </div>
                </div>
            </div>
            <button class="info-btn" @click="sureGrant" type="button">
                确认发放
            </button>
        </mt-popup>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import SearchBarPro from '@/components/common/searchBarPro.vue';
import debounce from 'lodash/debounce';
import NonePromoter from '@/components/promoterInfo/nonePromoter.vue';
import { idNoFormat } from '@/assets/js/utils.js';
const ModalHelper = (() => {
    return {
        afterOpen: function() {
            let appSt = document.getElementById('app');
            appSt.style.position = 'fixed';
        },
        beforeClose: function() {
            let appSt = document.getElementById('app');
            appSt.style.position = 'static';
        }
    };
})();
export default {
    components: {
        NavBar,
        SearchBarPro,
        NonePromoter
    },
    data() {
        return {
            popupVisible: false,
            curPagerNo: 1, // 当前页数
            pageSize: 10,
            employeeList: [],
            search: '',
            userInfo: '',
            loaded: false, // 当前页是否请求完成
            hasMore: false // 是否还有数据
        };
    },
    created() {
        this.getList();
    },
    mounted() {
        //监听滚动条
        this.$refs.grantInfoList.addEventListener(
            'scroll',
            debounce(this.scrollListener, 500)
        );
    },
    beforeDestroy() {
        this.$refs.grantInfoList.removeEventListener(
            'scroll',
            this.scrollListener
        );
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        scrollListener() {
            const list = this.$refs.grantInfoList;
            if (
                list.scrollHeight - list.scrollTop - list.offsetHeight < 10 &&
                this.hasMore
            ) {
                this.curPagerNo++;
                this.getList();
            }
        },
        //搜索框值
        searchCustomer(keyword) {
            this.search = keyword;
            this.loaded = false;
            this.hasMore = false;
            this.employeeList = [];
            this.getList();
        },
        getList() {
            let data = {};
            if (this.search) {
                data = {
                    search: this.search,
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
                    // console.log(this.employeeList, '选择推广员');
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
        //选择推广员确认信息
        getUserInfo(i) {
            this.popupVisible = true;
            this.userInfo = this.employeeList[i];
        },
        //确认发放
        sureGrant() {
            this.popupVisible = false;
            const data = {
                customerPhone: this.userInfo.employeeMobile,
                orderId: this.$route.query.orderId,
                goodId: this.$route.query.goodId,
                goodUnique: this.$route.query.goodUnique,
                customerName: this.userInfo.employeeName,
                employeeId: this.userInfo.employeeId
            };
            this.$api('/sm-api/redpackage/send', data).then(res => {
                Toast(res.showMsg);
            });

            setTimeout(() => {
                this.$router.push('/promoterReward');
            }, 0);
        }
    },
    watch: {
        popupVisible(newVal) {
            if (newVal) {
                ModalHelper.afterOpen();
            } else {
                ModalHelper.beforeClose();
            }
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
}
.popupWrapper {
    width: 100%;
    height: 350px;
    background-color: #fff;
    margin: 0;
    .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 55px;
        background: #f9fafb;
        border-radius: 5px 5px 0 0;
        text-align: center;
        p {
            font-size: 18px;
            letter-spacing: 0;
            line-height: 55px;
            margin-left: 151.5px;
        }
        img {
            width: 15px;
            height: 15px;
            margin: 0 14.5px;
        }
    }
    .info-confirm {
        margin: 20px 0 0;
        .confirm-item {
            margin-left: 25px;
            height: 47px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .item-type {
                width: 60px;
                font-size: 15px;
                color: #333333;
                letter-spacing: 0;
            }
            .item-value {
                margin-left: 35px;
                font-size: 16px;
                color: #262c32;
                letter-spacing: 0;
                text-align: right;
                line-height: 15px;
                font-weight: bold;
            }
        }
    }
    .info-btn {
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 45px;
        border-radius: 45px;
        width: 320px;
        height: 45px;
        font-size: 16px;
        line-height: 45px;
        color: #fff;
        text-align: center;
        margin-top: 80.5px;
        margin-left: 27.5px;
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
