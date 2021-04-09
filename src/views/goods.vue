/* 商品分期信息 */
<template>
    <div class="goods">
        <nav-bar title="商品分期信息" @back="back"></nav-bar>
        <div class="goods-title">
            <span>商品信息</span>
        </div>
        <div class="goods-outside">
            <div class="goods-item">
                <div class="goods-name">商品编码</div>
                <div class="goods-content">
                    <div class="inputBox">
                        <input
                            name="goodsName"
                            placeholder="请输入商品编码"
                            type="number"
                            v-model="goodsName"
                        />
                        <img
                            v-if="goodsName"
                            @click="hasInfoClear('goodsName')"
                            class="clear"
                            src="@/assets/img/applyList/clear.png"
                            alt
                        />
                    </div>
                    <button
                        class="add-btn"
                        :class="goodsName.length > 0 ? 'opacityBtn' : ''"
                        @click="addGoods"
                    >
                        添加
                    </button>
                </div>
                <!-- 添加的商品 -->
                <div class="goods-list">
                    <div
                        class="goods-detail"
                        v-for="(item, index) in goodsList"
                        :key="index"
                    >
                        <div class="goods-detail-code">
                            商品：
                            <span>{{ item.goodsName }}</span>
                        </div>
                        <div class="goods-detail-num">
                            <div class="detail-num-left">
                                数量：
                                <span>x{{ item.num }}</span>
                            </div>
                            <div class="detail-num-right">
                                <span
                                    class="calculate-left"
                                    @click="reduce(item.num, index)"
                                >
                                    -
                                </span>
                                <span class="calculate-center">
                                    {{ item.num }}
                                </span>
                                <span
                                    class="calculate-right"
                                    @click="addNumber(item.num, index)"
                                >
                                    +
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="goods-item">
                <div class="goods-name">商品总价</div>
                <div class="goods-content">
                    <div class="goods-inputBox">
                        <input
                            placeholder="请输入商品总价"
                            type="number"
                            @focus="verifyInputGoods"
                            @input="checkInputGoods()"
                            v-model="goodsTotal"
                        />
                        <img
                            v-if="goodsTotal"
                            @click="hasInfoClear('goodsTotal')"
                            class="clear"
                            src="@/assets/img/applyList/clear.png"
                            alt
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="goods-title">
            <span>分期信息</span>
        </div>
        <div class="goods-outside">
            <div class="in-item">
                <div class="in-item-one" @click="openStagingRate">
                    <div class="in-item-type">分期费率</div>
                    <div class="in-item-value">
                        <span
                            :class="{
                                'in-item-text': currentStagingRateIndex !== ''
                            }"
                        >
                            {{
                                currentStagingRateIndex === ''
                                    ? '请选择分期费率'
                                    : this.currentStaging.promotionRate
                            }}
                        </span>
                        <img src="@/assets/img/applyList/jump.png" alt />
                    </div>
                </div>
                <div class="in-item-one" @click="openInstallmentPeriods">
                    <div class="in-item-type">分期期数</div>
                    <div class="in-item-value">
                        <span
                            :class="{
                                'in-item-text': currentPeriodsIndex !== ''
                            }"
                        >
                            {{
                                currentPeriodsIndex === ''
                                    ? '请选择分期期数'
                                    : currentPeriods
                            }}
                        </span>
                        <img src="@/assets/img/applyList/jump.png" alt />
                    </div>
                </div>
                <div class="in-item-one">
                    <div class="in-item-type">
                        首付比例
                        <span class="mark" v-if="downPaymentRatioText">
                            (注:需{{ downPaymentRatioText }}%以上)
                        </span>
                    </div>
                    <div class="in-item-value">
                        <input
                            class="in-item-input"
                            type="number"
                            v-model="downPaymentRatio"
                            @input="inputDownPaymentRatio"
                            @focus="verifydownPaymentRatio"
                        />
                        %
                    </div>
                </div>
                <div class="in-item-one">
                    <div class="in-item-type">首付金额</div>
                    <div class="in-item-value">
                        <input
                            class="in-item-input"
                            placeholder="请输入首付金额"
                            type="number"
                            v-model="downPaymentAmount"
                            @input="inputDownPaymentAmount"
                            @focus="verifydownPaymentAmount"
                        />
                    </div>
                </div>
                <div class="in-item-one">
                    <div class="in-item-type">分期方式</div>
                    <div class="in-item-value">
                        <span class="in-item-text">
                            {{
                                orderDetail.periodType === 1
                                    ? '国美分期-M'
                                    : '国美分期'
                            }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer" v-if="hideshow">
            <button
                type="button"
                @click="goodConfirm"
                :disabled="false"
                class="footer-btn"
            >
                <span>下一步</span>
            </button>
        </div>

        <!-- 底部弹框 -分期费率-->
        <PopStagingRate
            :productList="productList"
            :stagingRate="stagingRate"
            @stagingRates="stagingRates"
            @chooseStagingRate="chooseStagingRates"
        ></PopStagingRate>

        <!-- 底部弹框 -分期期数-->
        <mt-popup
            class="popupWrapper"
            v-model="installmentPeriods"
            position="bottom"
            @touchmove.prevent
        >
            <div class="pop-header">
                <div class="outside"></div>
                <p>分期期数</p>
                <div class="outside">
                    <img
                        src="@/assets/img/applyList/close.png"
                        alt="close"
                        @click="installmentPeriods = false"
                    />
                </div>
            </div>
            <div class="popup-item scroll">
                <div
                    class="btn-item"
                    v-for="(item, index) in periodsList"
                    :key="index"
                    @click="choosePeriods(item, index)"
                >
                    <div
                        class="btn-item-text"
                        :class="{ isActive: currentPeriodsIndex === index }"
                    >
                        {{ item }}
                        <img
                            v-if="currentPeriodsIndex === index"
                            src="@/assets/img/applyList/selected.png"
                            alt
                        />
                    </div>
                </div>
            </div>
        </mt-popup>

        <!-- 底部弹框 -其他信息-->
        <mt-popup
            class="popupWrapper"
            v-model="otherInfor"
            position="bottom"
            closeOnClickModal
        >
            <div class="pop-header">
                <div class="outside"></div>
                <p>其他信息</p>
                <div class="outside">
                    <img
                        src="@/assets/img/applyList/close.png"
                        alt="close"
                        @click="otherInfor = false"
                    />
                </div>
            </div>
            <div class="popup-item">
                <div class="other-item">
                    <div class="condition">婚姻状况</div>
                    <div class="other-item-btn">
                        <div
                            class="condition-btn"
                            :class="{ isActive: maritalIndex === index }"
                            v-for="(item, index) in maritalList"
                            :key="index"
                            @click="chooseMarital(item, index)"
                        >
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="other-item">
                    <div class="condition">客户情况</div>
                    <div class="other-item-btn">
                        <div
                            class="condition-btn"
                            :class="{ isActive: refused }"
                            @click="refused = !refused"
                        >
                            拒绝
                        </div>
                        <div
                            class="condition-btn"
                            :class="{ isActive: !refused }"
                            @click="refused = !refused"
                        >
                            正常
                        </div>
                    </div>
                </div>
            </div>
            <button @click="otherInforConfirm" type="botton" class="popup-btn">
                下一步
            </button>
        </mt-popup>
    </div>
</template>

<script>
import NavBar from '@/components/common/navBar.vue';
import PopStagingRate from '@/components/goods/popStagingRate.vue'; //分期费率

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
    name: 'goods',
    data() {
        return {
            /* 商品信息 */
            goodsName: '', //商品编码
            goodsTotal: '', // 总价格
            replaceGoodsTotal: '', // 总价格--替代
            goodsList: [], //商品列表
            otherInfor: false, //其他信息
            refused: false, //是否拒绝
            maritalList: [
                { name: '已婚', nameIn: '1' },
                { name: '未婚', nameIn: '2' },
                { name: '其他', nameIn: '9' }
            ], //其他信息
            maritalIndex: '', // 婚姻下标
            maritalStatus: '', //婚姻状况
            maxPromotionRate: 0, //当前数据列表中遍历最大的最大的分期数
            productInfo: {}, //分期期数获取的所有数据
            /*  分期费率*/
            stagingRate: false, //分期费率弹框
            productList: [], // 分期费率获取的所有数据
            currentStagingRateIndex: '', // 分期费率下标
            currentStaging: {}, //当前分期费率对象
            /* 分期期数 */
            installmentPeriods: false, //分期期数弹框
            periodsList: [], // 分期期数列表
            currentPeriods: '', // 当前的分期
            currentPeriodsIndex: '', //当前的分期下标
            downPaymentRatioText: '', //首付比例注释最低
            downPaymentRatio: '', // 首付比例
            replaceRatio: '', // 首付比例-替代
            downPaymentAmount: '', // 首付金额
            replaceAmount: '', // 首付金额-替代
            /* 计算器 */
            categoryCodeNum: 0, //相同品类数量
            isHaveCateCode: false, // 是否含有此品类
            isHaveSkuCode: false, //是否已有sku
            productIndex: 0, //相同sku位置
            lastPageData: '', // 上个页面数据
            member: {}, //sessionStorage 数据
            orderDetail: {}, //sessionStorage 数据 订单详情
            /*软键盘弹出时底部顶起 */
            docmHeight: document.documentElement.clientHeight, //默认屏幕高度
            showHeight: document.documentElement.clientHeight, //实时屏幕高度
            hideshow: true //显示或者隐藏footer
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (
                from.path.indexOf('review') > -1 ||
                from.path.indexOf('merchants') > -1
            ) {
                vm.$store.dispatch('setKeepAlive', ['goods', 'merchants']);
            } else {
                vm.$store.dispatch('setKeepAlive', ['goods']);
            }
        });
    },
    methods: {
        back() {
            /* 取消弹框 */
            MessageBox({
                title: '提示',
                message: '返回至上一页面后，此页面信息会丢失，是否确认返回',
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                confirmButtonClass: 'confirmButton',
                cancelButtonClass: 'cancelButton'
            }).then(action => {
                if (action === 'confirm') {
                    this.$router.go(-1);
                }
            });
        },
        /* ************分期费率*************** */
        /* 组件传递参数 */
        stagingRates(val) {
            this.stagingRate = val;
        },
        /* 选择分期费率 */
        chooseStagingRates(item, index) {
            this.currentStagingRateIndex = index;
            this.currentStaging = item;
            this.stagingRate = false;
            this.getProductInfo(); //调取分期期数
        },
        checkInputGoods() {
            if (this.goodsList.length === 0) {
                this.goodsTotal = '';
                return;
            }
            if (this.goodsList.length === 0) {
                Toast('请先添加商品');
                return;
            }
            if (this.goodsTotal < 0) {
                Toast('总价必须大于0元');
                return;
            }
            this.goodsTotal = this.goodsTotal
                .replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
                .replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
                .replace('.', '$#$')
                .replace(/\./g, '')
                .replace('$#$', '.')
                .replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            if (this.goodsTotal.indexOf('.') > -1) {
                //判断有没有输入小数点
            } else {
                let p1 = /[^\d]/g;
                let p2 = /(\d{6})\d*$/g;
                let p3 = /(\d*)\6/g; //删除当我输入第七位的整数时候进行删除
                this.goodsTotal = this.goodsTotal
                    .replace(p1, '')
                    .replace(p2, '$1')
                    .replace(p3, '$1$9');
            }
            this.currentPeriods = ''; // 当前的分期
            this.currentPeriodsIndex = ''; // 当前的分期下标
            this.downPaymentRatioText = ''; //首付比例注释最低
            this.downPaymentRatio = ''; // 首付比例
            this.downPaymentAmount = ''; // 首付金额
        },
        /* input获得焦点验证 */
        verifyInputGoods() {
            if (this.goodsList.length === 0) {
                Toast('请先添加商品');
            }
        },

        /* ************添加**************** */
        /* 添加 */
        addGoods() {
            if (this.goodsName.trim() === '') {
                Toast('请添加商品');
                return;
            }
            /* 查询商品是否为活动商品 */
            this.getGoodDetail();
        },
        /* 清空输入框内容 */
        hasInfoClear(item) {
            if (item === 'goodsName') {
                this.goodsName = '';
            } else if (item === 'goodsTotal') {
                this.goodsTotal = '';
            }
        },
        /* 获取分期商品 */
        getGoodDetail() {
            let sellerEntity = this.orderDetail.sellerEntity;
            const data = {
                stageProductActivityCode: this.productList.activityCode,
                activityCode: sellerEntity.activityCode || '', //活动code
                productCode: this.productList.activityCode || '',
                merchantType: '1',
                sku: this.goodsName.trim() //商品编码
            };

            this.$api('/sm-api/goodDetail', data).then(res => {
                this.goodsName = '';
                if (res.code === 0) {
                    /* 1》判断品类可添加数是否为零 */
                    if (res.data.count === 0) {
                        Toast('该品类最多添加0件商品');
                        return;
                    }
                    /* 2>最大添加sku为20个 */
                    if (this.goodsList.length >= 20) {
                        Toast('单次进件最多添加20个sku');
                        return;
                    }
                    /* 3>判断列表是否是第一次添加 */
                    if (this.goodsList.length === 0) {
                        let goodDetail = res.data;
                        goodDetail.num = 1;
                        this.goodsList = this.goodsList.concat(goodDetail);
                        return;
                    }
                    /* 4>判断商品是否有相同的 */
                    let goodsCode = res.data.goodsCode;
                    this.goodsList.map((item, index) => {
                        if (item.goodsCode === goodsCode) {
                            /* 代表原数组有这个相同品类的商品 */
                            this.isHaveCateCode = true;
                            this.isHaveSkuCode = true;
                            this.productIndex = index;
                        }
                        return;
                    });

                    /* 商品相同 */
                    if (this.isHaveSkuCode) {
                        /* 判断是否超过添加的最大数量 */
                        let categoryCode = res.data.categoryCode;
                        let count = this.goodsList[this.productIndex].count; // 品类最大数量
                        /* 获取当前列表相同品类数量 */
                        this.goodsList.map(item => {
                            if (item.categoryCode === categoryCode) {
                                if (item.num === 1) {
                                    this.categoryCodeNum =
                                        this.categoryCodeNum + 1;
                                } else {
                                    this.categoryCodeNum =
                                        this.categoryCodeNum + item.num;
                                }
                            }
                            return;
                        });
                        /* 判断添加的品类小于最大数量 */
                        if (this.categoryCodeNum < count) {
                            let list = this.goodsList;
                            list[this.productIndex].num =
                                list[this.productIndex].num + 1;
                            this.goodsList = list;
                            this.categoryCodeNum = 0;
                            this.isHaveSkuCode = false;
                            this.emptyData();
                            return;
                        }
                        this.categoryCodeNum = 0;
                        this.isHaveSkuCode = false;
                        Toast('当前品类商品超过添加最大数量');
                        return;
                    }

                    if (!this.isHaveSkuCode) {
                        /* 商品不同校验品类 */
                        let categoryCode = res.data.categoryCode;
                        let count = res.data.count; // 品类最大数量
                        this.goodsList.map(item => {
                            if (item.categoryCode === categoryCode) {
                                if (item.num === 1) {
                                    this.categoryCodeNum =
                                        this.categoryCodeNum + 1;
                                } else {
                                    this.categoryCodeNum =
                                        this.categoryCodeNum + item.num;
                                }
                            }
                            return;
                        });
                        if (this.categoryCodeNum < count) {
                            let goodDetail = res.data;
                            goodDetail.num = 1;
                            this.isHaveCateCode = false;
                            this.isHaveSkuCode = false;
                            this.categoryCodeNum = 0;
                            this.productIndex = 0;
                            this.goodsList = this.goodsList.concat(goodDetail);
                            this.emptyData();
                        } else {
                            this.isHaveCateCode = false;
                            this.isHaveSkuCode = false;
                            this.categoryCodeNum = 0;
                            this.productIndex = 0;
                            Toast('当前品类商品超过添加最大数量');
                        }
                    }
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 添加商品数量 */
        addNumber(num, index) {
            let count = this.goodsList[index].count; //品类最大数量
            let categoryCode = this.goodsList[index].categoryCode;
            /* 获取当前列表相同品类数量 */
            this.goodsList.map(item => {
                if (item.categoryCode === categoryCode) {
                    if (item.num === 1) {
                        this.categoryCodeNum = this.categoryCodeNum + 1;
                    } else {
                        this.categoryCodeNum = this.categoryCodeNum + item.num;
                    }
                }
                return;
            });
            if (this.categoryCodeNum < count) {
                this.goodsList[index].num = num + 1;
                this.categoryCodeNum = 0;
            } else {
                this.categoryCodeNum = 0;
                Toast({
                    message: '当前商品超过添加最大数量',
                    duration: 1000
                });
            }
        },
        /* 减少商品数量 */
        reduce(num, index) {
            if (Number(num) === 1) {
                MessageBox({
                    title: '提示',
                    message: '确认删除商品?',
                    showCancelButton: true,
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'confirmButton',
                    cancelButtonClass: 'cancelButton'
                }).then(action => {
                    if (action === 'confirm') {
                        this.goodsList.splice(index, 1);
                        /* 如果删除商品列表的话下面全清空 */
                        if (this.goodsList.length === 0) {
                            this.goodsTotal = '';
                            this.currentStagingRateIndex = ''; // 分期费率下标
                            this.currentStaging = {}; //当前分期费率对象
                            this.currentPeriods = ''; // 当前的分期
                            this.currentPeriodsIndex = ''; //当前的分期下标
                            this.downPaymentRatio = '';
                            this.downPaymentRatioText = '';
                            this.downPaymentAmount = '';
                        }
                    }
                });
            } else {
                this.goodsList[index].num = num - 1;
            }
        },
        /* 打开分期列表弹框 */
        openStagingRate() {
            if (this.goodsList.length === 0) {
                Toast('请先添加商品');
                return;
            } else if (this.goodsTotal === '') {
                Toast('请先输入商品总价');
                return;
            }
            this.stagingRate = true;
        },
        /* 获取分期费率 ---- 第一步 */
        getProductList() {
            let sellerEntity = this.orderDetail.sellerEntity;
            const data = {
                merchantType: '1',
                activityCode: sellerEntity.activityCode || '', //活动code
                businessType: 'MYFEN',
                loanApplyNo: this.member.applyNo,
                userToken: this.member.accessToken,
                storeCode: sellerEntity.storeCode
            };
            this.$api('/sm-api/term/productList', data).then(res => {
                if (res.code === 0) {
                    this.productList = res.data;
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 打开分期弹框 */
        openInstallmentPeriods() {
            if (!this.currentStaging.promotionRate) {
                Toast('请先选择分期费率');
                return;
            } else if (this.goodsTotal === '') {
                Toast('请先输入商品总价');
                return;
            }
            this.installmentPeriods = true;
        },
        /* 清空数据 */
        emptyData() {
            this.currentPeriods = ''; // 当前的分期
            this.currentPeriodsIndex = ''; // 当前的分期下标
            this.downPaymentRatioText = ''; //首付比例注释最低
            this.downPaymentRatio = ''; // 首付比例
            this.downPaymentAmount = ''; // 首付金额
            if (
                this.goodsTotal !== '' &&
                JSON.stringify(this.currentStaging) !== '{}' &&
                this.currentStaging.productCode !== ''
            ) {
                this.getProductInfo();
            }
        },
        /* 获取分期期数*/
        getProductInfo() {
            let info = this.goodsList;
            info = info.map(item => {
                item = {
                    sku: item.goodsCode,
                    isthreeC: item.isThreeCorridors,
                    categoryCode: item.categoryCode,
                    brandCode: item.brandCode,
                    downPaymentRatio: item.downPaymentRatio
                };
                return item;
            });
            const data = {
                productCode: this.currentStaging.productCode,
                activityCode: this.currentStaging.activityCode || '',
                businessType: 'MYFEN',
                goodInfo: info, //商品列表-遍历转成数组--在转成json字符串
                goodsTotal: this.goodsTotal //总价格
            };
            this.$api('/sm-api/term/productInfo', data).then(res => {
                if (res.code === 0) {
                    this.productInfo = res.data;
                    this.periodsList = res.data.periods.split(',');
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 选择期数 */
        choosePeriods(item, index) {
            this.currentPeriodsIndex = index;
            this.currentPeriods = item;
            this.installmentPeriods = false;
            /* 处理首付金额----  首付比例 */
            this.downPaymentRatio = this.productInfo.downPaymentRatio.toFixed(
                2
            );
            this.downPaymentRatioText = this.productInfo.downPaymentRatio;
            this.downPaymentAmount = (
                (this.goodsTotal / 100) *
                this.downPaymentRatio
            ).toFixed(2);
        },
        /* 选择分期费率 */
        chooseStagingRate(item, index) {
            this.currentStagingRateIndex = index;
            this.currentStaging = item;
            this.stagingRate = false;
            this.getProductInfo(); //调取分期期数
        },
        /* 首付比例 */
        inputDownPaymentRatio() {
            if (!this.currentStaging.promotionRate) {
                Toast('请选择分期费率');
                this.downPaymentRatio = '';
                return;
            } else if (this.currentPeriods === '') {
                Toast('请选择分期期数');
                this.downPaymentRatio = '';
                return;
            }
            if (this.downPaymentRatio === '') {
                this.downPaymentAmount = '';
                return;
            }
            let reg = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[0-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
            let re = new RegExp(reg);
            if (re.test(this.downPaymentRatio)) {
                this.downPaymentAmount = (
                    (this.goodsTotal / 100) *
                    this.downPaymentRatio
                ).toFixed(2);
                this.replaceRatio = this.downPaymentRatio;
            } else {
                if (this.downPaymentRatio > 100) {
                    Toast('首付比例需要小于等于100%');
                }
                this.downPaymentRatio = this.replaceRatio;
            }
        },
        verifydownPaymentRatio() {
            if (!this.currentStaging.promotionRate) {
                Toast('请选择分期费率');
                return;
            } else if (this.currentPeriods === '') {
                Toast('请先选择分期期数');
                return;
            }
        },
        /* 首付金额 */
        inputDownPaymentAmount() {
            if (!this.currentStaging.promotionRate) {
                Toast('请选择分期费率');
                this.downPaymentAmount = '';
                return;
            } else if (this.currentPeriods === '') {
                Toast('请选择分期期数');
                this.downPaymentAmount = '';
                return;
            }
            if (this.downPaymentAmount === '') {
                this.downPaymentRatio = '';
                return;
            }
            let reg = /^\d+(.\d{1,2})?$/;
            let re = new RegExp(reg);
            if (re.test(this.downPaymentAmount)) {
                if (Number(this.downPaymentAmount) <= this.goodsTotal) {
                    this.replaceAmount = this.downPaymentAmount;
                    this.downPaymentRatio = (
                        (this.downPaymentAmount / this.goodsTotal) *
                        100
                    ).toFixed(2);
                } else {
                    this.downPaymentAmount = this.replaceAmount;
                    Toast('首付金额需要小于等于总价');
                }
            } else {
                this.downPaymentAmount = this.replaceAmount;
            }
        },
        verifydownPaymentAmount() {
            if (!this.currentStaging.promotionRate) {
                Toast('请选择分期费率');
                return;
            } else if (this.currentPeriods === '') {
                Toast('请先选择分期期数');
                return;
            }
        },
        /* ***********商品分期页提交********************* */
        goodConfirm() {
            if (this.goodsList.length === 0) {
                Toast('请添加商品');
                return;
            } else if (this.goodsTotal === '') {
                Toast('请填写商品总价');
                return;
            } else if (!this.currentStaging.promotionRate) {
                Toast('请选择分期费率');
                return;
            } else if (this.currentPeriods === '') {
                Toast('请选择分期期数');
                return;
            } else if (this.downPaymentRatio === '') {
                Toast('请输入首付比例');
                return;
            } else if (
                this.downPaymentRatio < this.downPaymentRatioText ||
                this.downPaymentRatio > 100
            ) {
                Toast(
                    '首付比例不在上下限区间【' +
                        this.downPaymentRatioText +
                        '-100%】内，请检查'
                );
                return;
            } else if (
                this.productInfo.lowlimit >
                    this.goodsTotal - this.downPaymentAmount ||
                this.productInfo.toplimit <
                    this.goodsTotal - this.downPaymentAmount
            ) {
                Toast(
                    '分期金额不在上下限区间内【' +
                        this.productInfo.lowlimit +
                        '-' +
                        this.productInfo.toplimit +
                        '】，请检查'
                );
                return;
            } else if (
                this.goodsTotal < this.productInfo.minAmount ||
                this.productInfo.maxAmount < this.goodsTotal
            ) {
                Toast(
                    '商品总价不在上下限区间内【' +
                        this.productInfo.minAmount +
                        '-' +
                        this.productInfo.maxAmount +
                        '】，请检查'
                );
                return;
            }
            let info = this.goodsList;
            info = info.map(item => {
                if (item.downPaymentRatio > this.maxPromotionRate) {
                    /* 遍历取最大的分期费率 */
                    this.maxPromotionRate = item.downPaymentRatio;
                }
                item = {
                    quantity: item.num.toString(),
                    maxbuyCount: item.count.toString(),
                    sku: item.goodsCode,
                    goodDescription: item.goodsName,
                    heasbuyCount: item.isThreeCorridors, //是否是3C
                    downPayment: item.downPaymentRatio.toString(), //最大首付比例
                    goodName: item.goodsName,
                    goodBrand: item.brandCode,
                    goodsType: item.categoryCode // 商品分类
                };
                return item;
            });
            let instalmentReq = {
                downPaymentAmount: this.downPaymentAmount.toString(), //首付金额
                downPaymentRatio: this.downPaymentRatio.toString(), //当期页面分期比例
                loanTerm: this.currentPeriods //分期期数
            };
            const data = {
                loanApplyNo: this.member.applyNo, //上个页面传进来的 applyNo
                userToken: this.member.accessToken, //上个页面传进来的 accessToken
                applyProgress: '2', //写死
                goodsTotal: this.goodsTotal, //总价格
                periodProduct: this.currentStaging.productName, // 分期费率产品列表 productName --- 分期费率列表返回
                periodProductCode: this.currentStaging.productCode, //分期费率产品列表 productCode --- 分期费率列表返回
                wareList: info, // 当前页面所有产品-商品列表-遍历转成数组--不用转Json
                instalmentReq: instalmentReq,
                saveFlag: 'N', //
                discountCode: this.currentStaging.activityCode || '', //  分期费率产品列表 activityCode
                useRepayCoupon: this.orderDetail.periodType || '0', //是否使用优惠卷
                periodProductRate: this.currentStaging.promotionRate, //  分期费率产品列表  promotionRate
                jinLiPayOrderNum: '',
                // periodProductRateDecimal: '',
                smallTicket: '',
                goodDownPaymentRatio: this.maxPromotionRate.toString() //最低首付比列  遍历商品列表 取最大的在一个 downPaymentRatio  -- 字段
            };
            this.$api('/sm-api/good/term/confirm', data).then(res => {
                if (res.data.code === 0) {
                    this.$store.dispatch('setIsModify', true);
                    this.$store.dispatch('setIsOther', true);
                    this.otherInfor = true;
                    this.getQueryCustomerInfo();
                } else {
                    Toast(res.data.showMsg);
                }
            });
        },
        /* 查询婚姻状态接口 */
        getQueryCustomerInfo() {
            const data = {
                userId: this.member.userId,
                customerId: this.member.customerId
            };
            this.$api('/sm-api/queryCustomerInfo', data).then(res => {
                if (res.code === 0) {
                    this.maritalStatus = res.data.data.marriageStatus;
                    if (this.maritalStatus === 1) {
                        this.maritalIndex = 0;
                    } else if (this.maritalStatus === 2) {
                        this.maritalIndex = 1;
                    } else if (this.maritalStatus === 9) {
                        this.maritalIndex = 2;
                    }
                } else {
                    Toast(res.showMessage);
                }
            });
        },
        /* 婚姻选择 */
        chooseMarital(item, index) {
            this.maritalIndex = index;
            this.maritalStatus = item.nameIn;
        },
        /* 提交 --- 其他信息下一步 */
        otherInforConfirm() {
            const data = {
                loanApplyNo: this.member.applyNo, //上个页面传进来的 applyNo
                userToken: this.member.accessToken, //上个页面传进来的 accessToken
                applyProgress: '3',
                situation: this.refused ? '1$$拒绝' : '4$$正常', //客户情况  正常  拒绝
                businessType: 'MYFEN',
                marriageState: this.maritalStatus, // 婚姻状况  129  未婚 ，已婚 ， 其他
                userId: this.member.userId, //扫码过来的
                customerId: this.member.customerId //   继续办理传过来的customerId
            };
            this.$api('/sm-api/other/confirm', data).then(res => {
                if (res.code === 0) {
                    this.otherInfor = false;
                    this.$router.push({
                        name: 'Review'
                    });
                } else {
                    Toast(res.showMsg);
                }
            });
        },
        /* 复核信息查询 */
        getOrderDetail() {
            const data = {
                loanApplyNo: this.member.applyNo,
                token: this.member.accessToken,
                businessType: 'MYFEN'
            };
            return this.$api('/sm-api/orderDetail', data).then(res => {
                if (res.code === 0) {
                    this.orderDetail = res.data;
                    this.getProductList(); //获取分期---进来先掉这个接口
                    if (
                        res.data.applyProgress === '2' &&
                        this.$store.state.isOther
                    ) {
                        this.getQueryCustomerInfo();
                        this.otherInfor = true;
                    }
                } else {
                    Toast(res.showMessage);
                }
                return;
            });
        }
    },
    watch: {
        stagingRate(newVal) {
            if (newVal) {
                ModalHelper.afterOpen();
            } else {
                ModalHelper.beforeClose();
            }
        },
        installmentPeriods(newVal) {
            if (newVal) {
                ModalHelper.afterOpen();
            } else {
                ModalHelper.beforeClose();
            }
        },
        /* 解决底部按钮被顶起 */
        showHeight: function() {
            if (this.docmHeight > this.showHeight) {
                this.hideshow = false;
            } else {
                this.hideshow = true;
            }
        }
    },
    mounted() {
        /* 解决底部按钮被顶起 */
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight;
            })();
        };
        this.member = JSON.parse(sessionStorage.getItem('member'));
        this.getOrderDetail();
        this.otherInfor = false;
    },
    components: {
        NavBar,
        PopStagingRate
    },
    updated() {
        /* 解决底部按钮被顶起 */
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight;
            })();
        };
    },
    activated() {
        /* 解决底部按钮被顶起 */
        window.onresize = () => {
            return (() => {
                this.showHeight = document.body.clientHeight;
            })();
        };
    },
    destroyed() {
        MessageBox.close(false);
    }
};
</script>
<style lang="scss">
.mint-msgbox {
    border-radius: 10px;
}
.mint-msgbox-message {
    font-size: 15px;
    color: #262c32;
    letter-spacing: 0;
    text-align: center;
}
.mint-msgbox-content {
    padding-top: 25px;
    padding-bottom: 25px;
}
.mint-msgbox {
    width: 71%;
}
input::-webkit-input-placeholder {
    color: #b3b8bd;
    font-size: 16px;
    line-height: 16px;
}
input:-moz-placeholder {
    color: #b3b8bd;
    font-size: 16px;
    line-height: 16px;
    vertical-align: center;
}
input::-moz-placeholder {
    color: #b3b8bd;
    font-size: 16px;
    line-height: 16px;
}
input:-ms-input-placeholder {
    color: #b3b8bd;
    font-size: 16px;
    line-height: 16px;
}
</style>

<style lang="scss" scoped>
.clearfix:after {
    display: block;
    content: ' ';
    clear: both;
    font-size: 0;
    visibility: hidden;
}
.goods {
    height: 100%;
    overflow: auto;
    background: #f3f5f7 !important;
    padding-bottom: 65px;
    .goods-title {
        margin: 16.5px 15px 11px;
        span {
            position: relative;
            padding-left: 5px;
            &:after {
                content: '';
                width: 2px;
                height: 14px;
                position: absolute;
                top: 4px;
                left: 0;
                background-image: linear-gradient(
                    90deg,
                    #00b07e 0%,
                    #0a9c70 99%
                );
            }
        }
    }
    .goods-outside {
        background: #f4f5f7;
        margin: 10px 15px;
        .goods-item {
            background: #fff;
            border-radius: 5px;
            padding-top: 22px;
            margin-bottom: 10px;
            .goods-name {
                padding: 0 15px;
                font-size: 14px;
                color: #5a6066;
                letter-spacing: 0.7px;
                line-height: 12px;
                margin-bottom: 11px;
            }
            .goods-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 28px;
                padding: 0 15px 7px;
                .inputBox {
                    position: relative;
                    input {
                        padding-right: 20px;
                        width: 247.5px;
                        font-size: 17px;
                        height: 18px;
                        font-size: 17px;
                        caret-color: #0a9c70; //光标颜色
                    }
                    .clear {
                        position: absolute;
                        right: 0px;
                        top: 5px;
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                    }
                }

                .goods-inputBox {
                    position: relative;
                    width: 100%;
                    input {
                        padding-right: 20px;
                        width: 100%;
                        font-size: 17px;
                        height: 18px;
                        font-size: 17px;
                        caret-color: #0a9c70; //光标颜色
                    }
                    .clear {
                        position: absolute;
                        right: 0px;
                        top: 5px;
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                    }
                }

                .add-btn {
                    background-image: linear-gradient(
                        90deg,
                        #4dc6a4 0%,
                        #1daf83 100%
                    );
                    width: 59px;
                    height: 28px;
                    border-radius: 14px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.5);
                    line-height: 12px;
                    opacity: 0.7;
                }
                .opacityBtn {
                    opacity: 1;
                    color: #fff;
                }
            }
            .goods-list {
                // background: linear-gradient(90deg, #4dc6a4 0%, #1daf83 100%);
                border-radius: 1px;
                padding: 0 15px;
                border-radius: 0 0 5px 5px;
                background-color: #f5fcfa;

                .goods-detail {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 20px 0;
                    position: relative;
                    &:last-child {
                        border: none;
                    }
                    .goods-detail-code {
                        width: 234px;
                        font-size: 14px;
                        color: #5a6066;
                        span {
                            line-height: 12px;
                        }
                    }
                    .goods-detail-num {
                        font-size: 12px;
                        color: #7a7f85;
                        line-height: 11px;
                        position: relative;
                        .detail-num-right {
                            position: absolute;
                            top: -10px;
                            right: 0;
                            width: 82px;
                            height: 22px;
                            display: flex;
                            align-items: center;
                            line-height: 22px;
                            text-align: center;
                            border-radius: 5px;
                            background: #ffffff;

                            .calculate-left {
                                border-radius: 5px 0 0 5px;
                                width: 26px;
                                border: 1px solid #dedede;
                            }
                            .equal-one {
                                color: #ebebeb;
                            }
                            .calculate-center {
                                border-top: 1px solid #dedede;
                                border-bottom: 1px solid #dedede;
                                width: 30px;
                                font-size: 12px;
                                color: #000000;
                                letter-spacing: 0;
                                text-align: center;
                            }
                            .calculate-right {
                                border: 1px solid #dedede;
                                color: #2b2a2a;
                                border-radius: 0 5px 5px 0;
                                width: 26px;
                            }
                        }
                    }
                    &:after {
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        content: '';
                        width: 100%;
                        height: 1px;
                        background: #dedede;
                        transform: scaleY(0.5);
                    }
                    &:last-child.goods-detail:after {
                        background: none;
                    }
                }
            }
        }
        .in-item {
            background: #fff;
            border-radius: 5px;
            padding: 0 15px;
            .in-item-one {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                width: 100%;
                position: relative;
                &:last-child {
                    border: none;
                }
                .in-item-type {
                    font-size: 14px;
                    color: #5a6066;
                    letter-spacing: 0;
                    line-height: 12px;
                    .mark {
                        font-size: 12px;
                        color: #ff4800;
                        letter-spacing: 0;
                        text-align: center;
                        width: 81px;
                    }
                }
                .in-item-value {
                    display: flex;
                    align-items: center;
                    span {
                        font-size: 16px;
                        color: #b3b8bd;
                        letter-spacing: 0;
                        text-align: right;
                        line-height: 14px;
                    }
                    img {
                        margin-left: 5px;
                        width: 4.7px;
                        height: 9px;
                    }
                    .in-item-input {
                        width: 112px;
                        font-size: 16px;
                        letter-spacing: 0;
                        text-align: right;
                        line-height: 14px;
                    }
                    .in-item-input::-webkit-input-placeholder {
                        color: #b3b8bd;
                    }
                    .in-item-text {
                        font-size: 16px;
                        color: #262c32;
                        letter-spacing: 0;
                        text-align: right;
                        line-height: 14px;
                    }
                }
                &:after {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    content: '';
                    width: 100%;
                    height: 1px;
                    background: #dedede;
                    transform: scaleY(0.5);
                }
                &:last-child.in-item-one:after {
                    background: none;
                }
            }
        }
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
/* 弹框 */
.popupWrapper {
    width: 100%;
    height: 300px;
    background-color: #fff;
    margin: 0;
    .pop-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 60px;
        background: #f9fafb;
        border-radius: 5px 5px 0 0;
        padding: 0 15px;
        .outside {
            width: 15px;
        }
        p {
            font-size: 18px;
            color: #262c32;
            letter-spacing: 0;
            text-align: center;
            line-height: 15px;
        }
        img {
            width: 15px;
            height: 15px;
            float: left;
        }
    }
    .popup-item {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        margin: 8px 0 0;
        .btn-item {
            margin: 0 20px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .btn-item-text {
                font-size: 16px;
                color: #262c32;
                letter-spacing: 0.305px;
                line-height: 16px;
                margin-right: 5px;
                position: relative;
                img {
                    position: absolute;
                    top: 2.5px;
                    right: -20px;
                    width: 15.7px;
                    height: 10.6px;
                }
            }
            .isActive {
                color: #0a9c70;
            }
            &:after {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                content: '';
                width: 100%;
                height: 1px;
                background: #dedede;
                transform: scaleY(0.5);
            }
        }
        .other-item {
            margin: 0 20px;
            height: 66.5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .condition {
                font-size: 14px;
                color: #5a6066;
                letter-spacing: 0;
                line-height: 15px;
                width: 100px;
            }
            .other-item-btn {
                display: flex;
                justify-content: flex-end;
                .condition-btn {
                    margin-left: 10px;
                    width: 65px;
                    border: 1px solid #dedede;
                    border-radius: 4px;
                    text-align: center;
                    line-height: 37px;
                    font-size: 14px;
                    letter-spacing: 0;
                    color: #5a6066;
                }
                .isActive {
                    color: #0a9c70;
                    background-color: #f3faf8;
                    border: 1px solid #0a9c70;
                }
            }
            &:after {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                content: '';
                width: 100%;
                height: 1px;
                background: #dedede;
                transform: scaleY(0.5);
            }
        }
    }
    .scroll {
        height: 240px;
    }
    .popup-btn {
        width: 320px;
        height: 45px;
        margin: 33px 22.5px 25px;
        line-height: 45px;
        background-image: linear-gradient(90deg, #00b07e 0%, #0a9c70 99%);
        border-radius: 22.5px;
        font-size: 16px;
        color: #fff;
        text-align: center;
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
</style>
