<template>
    <div>
        <nav-bar title="添加推广员" @back="back"></nav-bar>
        <div>
            <search-bar-pro
                @on-search="searchCustomer"
                @show-org="showOrg"
            ></search-bar-pro>
        </div>
        <div class="org">
            <div class="org_box" v-if="flag">
                <span class="org_bot_cor"></span>
                请搜索推广员信息添加推广员
            </div>
        </div>
        <div class="promoterList">
            <div
                class="list"
                v-for="(item, index) in employeeList"
                :key="index"
            >
                <p>
                    <span>
                        {{ item.employeeName }}（{{ item.employeeId }}）
                    </span>
                </p>
                <div>
                    {{ item.employeeMobile | changePhone }}
                </div>
                <div class="add" @click="add(index)">
                    <span>添加</span>
                </div>
            </div>
            <div class="addPro" v-if="addTip">
                <span>快去添加推广员吧</span>
            </div>
            <div class="addPro" v-if="tip">
                <span>暂未搜到相关内容</span>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import SearchBarPro from '@/components/common/searchBarPro.vue';
import { idNoFormat } from '@/assets/js/utils.js';
export default {
    components: {
        NavBar,
        SearchBarPro
    },
    data() {
        return {
            flag: true,
            employeeList: '',
            tip: false,
            addTip: true
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        searchCustomer(keyword) {
            this.flag = false;
            let data = {
                search: keyword
            };
            this.$api('/employee/queryEmployee', data).then(res => {
                if (res.resultCode === '1000') {
                    this.employeeList = res.data;
                    if (res.data.length === 0) {
                        this.tip = true;
                        this.addTip = false;
                    }
                    this.addTip = false;
                } else {
                    Toast(res.resultMsg);
                }
            });
        },
        showOrg() {
            this.flag = false;
        },
        add(index) {
            let data = {
                activeEmployee: this.$store.state.userInfo.personNo,
                unactiveEmployee: this.employeeList[index].employeePersonNo
            };
            this.$api('/employee/addEmployeeRelation', data)
                .then(res => {
                    console.log(res);
                    if (res.resultCode === '1000') {
                        Toast('添加成功');
                        this.$router.replace('/promoterInfo');
                    } else {
                        Toast(res.resultMsg);
                    }
                })
                .catch(err => {
                    console.log(err, 'err');
                });
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
.org {
    position: relative;
}
.org_box {
    width: 201px;
    height: 29px;
    line-height: 29px;
    margin-bottom: 30px;
    text-align: center;
    border: none;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 1px;
    left: 15px;
    border-radius: 5px;
    color: #fff;
    font-size: 13px;
}
.org_bot_cor {
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    left: 28px;
    top: -20px;
    z-index: 199;
}
.addPro {
    width: 200px;
    height: 115px;
    background: url('../assets/img/customer/noneCustomer.png') no-repeat;
    background-size: 200px 115px;
    margin: 137px 88px 20px 88px;
    position: relative;
    span {
        font-size: 16px;
        color: #5a6066;
        font-family: PingFangSC-Regular;
        font-weight: 500;
        position: absolute;
        top: 134px;
        left: 35.5px;
    }
}
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
            font-size: 16px;
            font-family: PingFangSC-Regular;
            color: #5a6066;
            margin-bottom: 15px;
        }
        .add {
            width: 65px;
            height: 28px;
            line-height: 24px;
            border: 1px solid #0a9c70;
            border-radius: 14px;
            position: absolute;
            top: 5px;
            right: 20px;
            text-align: center;
            span {
                color: #0a9c70;
                font-size: 12px;
                padding-left: 12px;
                &:before {
                    content: '';
                    width: 11px;
                    height: 11px;
                    position: absolute;
                    top: 8px;
                    left: 12px;
                    background: url('../assets/img/promoter/addGreen.png')
                        no-repeat;
                    background-size: 11px;
                }
            }
        }
    }
}
</style>
