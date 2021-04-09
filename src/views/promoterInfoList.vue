<template>
    <div class="promoterList-content">
        <nav-bar title="推广员信息" @back="back"></nav-bar>
        <div>
            <div class="info-title">
                <span class="info-title-name">{{ userInfo.employeeName }}</span>
            </div>
            <div class="info">
                <ul>
                    <li>
                        <span class="pro-tel">手机号</span>
                        <span class="InfoVal">
                            {{ userInfo.employeeMobile | changePhone }}
                        </span>
                    </li>
                    <li>
                        <span>推广员工号</span>
                        <span class="InfoVal">{{ userInfo.employeeId }}</span>
                    </li>
                    <li>
                        <span>奖励总笔数</span>
                        <span class="InfoVal">{{ info.allCount }}笔</span>
                    </li>
                    <li>
                        <span>奖励总金额</span>
                        <span class="InfoValCol">{{ info.allAmount }}元</span>
                    </li>
                    <li>
                        <span>已发总笔数</span>
                        <span class="InfoVal">{{ info.sendCount }}笔</span>
                    </li>
                    <li>
                        <span>已发总金额</span>
                        <span class="InfoValCol">{{ info.sendAmount }}元</span>
                    </li>
                </ul>
            </div>
            <div class="del" @click="importCancel()">
                <span>删除推广员</span>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import { idNoFormat } from '@/assets/js/utils.js';
export default {
    components: {
        NavBar
    },
    data() {
        return {
            delFlag: false,
            info: '',
            userInfo: JSON.parse(decodeURIComponent(this.$route.query.userInfo))
        };
    },
    created() {
        this.getPromiterInfo();
    },

    destroyed() {
        MessageBox.close(false);
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        //获取推广员详情
        getPromiterInfo() {
            const data = {
                saCode: this.$store.state.userInfo.personNo,
                employeeId: this.userInfo.employeeId
            };
            this.$api('/sm-api/rewardSum/query', data)
                .then(res => {
                    if (res.code === 0) {
                        this.info = res.data;
                    } else {
                        Toast(res.data.showMsg);
                    }
                })
                .catch(err => {
                    console.log(err, 'err');
                });
        },
        /* 点击取消按钮 */
        importCancel() {
            /* 取消弹框 */
            MessageBox({
                title: '',
                message: '是否确定删除推广员?',
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                confirmButtonClass: 'confirmButton',
                cancelButtonClass: 'cancelButton',
                closeOnClickModal: false
            }).then(action => {
                if (action === 'confirm') {
                    this.chooseConfirm();
                }
            });
        },
        chooseConfirm() {
            const data = {
                id: this.userInfo.id
            };
            this.$api('/employee/deleteEmployeeRelation', data)
                .then(res => {
                    if (res.resultCode === '1000') {
                        Toast(res.resultMsg);
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

<style lang="scss">
.promoterList-content {
    height: 100%;
    background: #f3f5f7;
    .info-title {
        padding: 16px 0px 0px 0px;
        position: relative;
        .info-title-name {
            padding-left: 22px;
            font-size: 16px;
            color: #262c32;
            font-family: PingFangHK-Regular;
            line-height: 14px;
            &:before {
                content: '';
                width: 2px;
                height: 14px;
                position: absolute;
                top: 20px;
                left: 15px;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
    }
    .info {
        width: 345px;
        height: 301px;
        background: #fff;
        padding: 25px 15px;
        margin: 15px;
        ul {
            li {
                padding-bottom: 25px;
                display: flex;
                span {
                    font-size: 15px;
                    color: #333333;
                }
                .pro-tel {
                    margin-right: 28px;
                }
                .InfoVal {
                    font-size: 16px;
                    padding-left: 60px;
                    font-weight: bold;
                }
                .InfoValCol {
                    font-size: 16px;
                    padding-left: 60px;
                    font-weight: bold;
                    color: #ff4800;
                }
            }
        }
    }
    .del {
        width: 160px;
        height: 45px;
        border: 1px solid #ff2e00;
        position: fixed;
        bottom: 25px;
        left: 107px;
        border-radius: 22px;
        text-align: center;
        line-height: 42px;
        span {
            color: #ff4800;
            font-size: 16px;
        }
    }
}
/* 取消弹框的样式 */
.cancelButton {
    font-size: 16px;
    color: #7a7f85;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.confirmButton {
    font-size: 16px;
    color: #0a9c70;
    letter-spacing: 0;
    text-align: center;
    line-height: 16px;
}
.mint-msgbox {
    border-radius: 10px;
}
.mint-msgbox-message {
    font-size: 15px;
    color: #262c32;
    letter-spacing: 0;
    text-align: center;
}
.mint-msgbox {
    width: 71%;
}
.memberList::-webkit-scrollbar {
    display: none;
}
</style>
