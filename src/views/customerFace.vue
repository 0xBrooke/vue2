/* 客户扫脸 */
<template>
    <div>
        <div class="customer-face" style="height: 100%" v-if="!successConfirm">
            <nav-bar title="客户扫脸" @back="back"></nav-bar>
            <div class="customer-wrap" @click="getLinkFaceToken">
                <img :src="submitPic === 1 ? faceing : faceSuccess" />
                <p :class="submitPic === 1 ? '' : 'faceSuccessText'">
                    {{ submitPic === 1 ? faceingText : faceSuccessText }}
                </p>
            </div>
            <div class="footer">
                <button
                    type="button"
                    class="footer-btn"
                    :disabled="submitPic === 1 ? true : false"
                    @click="confirm"
                >
                    <span>提交</span>
                </button>
            </div>
        </div>
        <Bounced v-if="successConfirm" :state="true" />
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import Bounced from '@/components/applyList/bounced.vue';
import { YK_JSBridge } from '@/assets/js/JSBride.js';
import { faceToast } from '@/assets/js/utils.js';

export default {
    name: 'customerFace',
    data() {
        return {
            faceing: require('@/assets/img/applyList/faceing.png'), //进行中
            faceSuccess: require('@/assets/img/applyList/faceSuccess.png'), //成功
            faceingText: '客户扫脸',
            faceSuccessText: '扫描成功',
            submitPic: 1,
            member: {},
            successConfirm: false
        };
    },
    created() {},
    methods: {
        back() {
            this.$router.go(-1);
        },

        /* 获取link face token */
        async getLinkFaceToken() {
            const res = await this.$api('/register/getLinkFaceToken', {
                token: this.$store.state.token,
                personNo: this.$store.state.userInfo.personNo
            });
            if (res.resultCode === '1000') {
                const faceToken = res.data.token;
                // 桥接调起face++
                const params = {
                    token: faceToken,
                    openVideo: 0, // 是否开启视频
                    openSound: 1, //是否开启音频
                    openRandom: 0, //是否随机动作
                    complexity: 1, // 复杂度
                    outType: 'singleImg',
                    sequence: ['BLINK', 'NOD', 'MOUTH', 'YAW'] // 动作
                };
                YK_JSBridge.callFace(params, res => {
                    // 如果成功则 调用 faceCheck
                    if (res.resultCode === '1000') {
                        /* 上传照片 */
                        this.getCostomerFaceCheck(res.arrLFImage[0].imageData);
                    } else {
                        // 失败后 message 提示
                        this.faceMessage(res.resultCode);
                    }
                });
            } else {
                Toast(res.resultMsg);
            }
        },
        // // face Toast
        faceMessage(faceCode) {
            Toast(faceToast[faceCode] || '活体校验失败,请重试');
        },
        /* 获取gps */
        async getPosition() {
            const pos = await YK_JSBridge.getLocation();
            return pos.data;
        },

        /* 上传照片 */
        async getCostomerFaceCheck(imageData) {
            const pos = await this.getPosition();
            if (pos && pos.latitude !== '') {
                const data = {
                    imageEnv: imageData, //图片第0个
                    personNo: this.$store.state.userInfo.personNo,
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                    loanApplySerialNo: this.member.applyNo,
                    userId: this.member.userId,
                    channelId: 'MYFEN',
                    ip: '127.0.0.1'
                };
                this.$api('/sm-api/costomerFaceCheck', data).then(res => {
                    if (res.code === 0) {
                        this.submitPic = 0;
                        Toast('扫脸成功');
                    } else {
                        Toast(res.showMsg);
                    }
                });
            } else {
                Toast('开启定位');
            }
        },

        /* 扫脸之后提交 */
        confirm() {
            const data = {
                loanApplyNo: this.member.applyNo, //编号 applyNo
                userToken: this.member.accessToken, //accessToken
                applyProgress: '5', //申请进度
                saveFlag: 'N', //是否攒单
                saveLoanApplyNo: ''
            };
            this.$api('/sm-api/picture/confirm', data).then(res => {
                // 弹框操作成功
                if (res.code === 0) {
                    this.successConfirm = true;
                    setTimeout(() => {
                        this.successConfirm = false;
                        this.$router.push({
                            name: 'Index'
                        });
                    }, 3000);
                } else {
                    Toast(res.showMsg);
                }
            });
        }
    },
    mounted() {
        this.member = JSON.parse(sessionStorage.getItem('member'));
    },
    components: {
        NavBar,
        Bounced
    }
};
</script>

<style lang="scss" scoped>
.customer-face {
    background: #f3f5f7;
    width: 100%;
    padding-top: 15px;
    .customer-wrap {
        margin: 0 auto;
        width: 345px;
        height: 200px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0.95;
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        img {
            margin-top: 25px;
            width: 120px;
            height: 120px;
        }
        p {
            margin-top: 20px;
            font-size: 14px;
            color: #262c32;
            letter-spacing: 0;
            font-family: PingFangSC-Regular, PingFang SC;
            text-align: center;
            line-height: 14px;
        }
        .faceSuccessText {
            color: #0a9c70;
        }
    }
    /* 底部按钮 */
    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 65px;
        padding: 10px 27.5px;
        opacity: 0.9;
        background: #fff;
    }
    .footer-btn {
        width: 320px;
        height: 45px;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 22.5px;
        &:disabled {
            opacity: 0.7;
            background-image: linear-gradient(90deg, #4dc6a4 0%, #1daf83 99%);
        }
    }
}
</style>
