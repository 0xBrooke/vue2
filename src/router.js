import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    base: process.env.VUE_APP_BASE_URL,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/login', // 登录页-小美帮客App默认永远进入到登录页
            name: 'Login',
            component: () => import('@/views/login')
        },
        {
            path: '/index', // 首页
            name: 'Index',
            component: () => import('@/views/index')
        },
        {
            path: '/qrCode', // 扫描二维码页
            name: 'QrCode',
            component: () => import('@/views/qrCode')
        },
        {
            path: '/idCard', // 上传身份证
            name: 'IdCard',
            component: () => import('@/views/idCard')
        },
        {
            path: '/applyList', // 进件列表
            name: 'ApplyList',
            component: () => import('@/views/applyList')
        },
        {
            path: '/codeConfirm', // 二维码/条形码确认信息页
            name: 'CodeConfirm',
            component: () => import('@/views/codeConfirm')
        },
        {
            path: '/merchantsChoose', // 商户选择页
            name: 'MerchantsChoose',
            component: () => import('@/views/merchantsChoose'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/customerFace', // 客户扫脸
            name: 'CustomerFace',
            component: () => import('@/views/customerFace')
        },
        {
            path: '/qrInput', //商户选择-输入条形码
            name: 'QrInput',
            component: () => import('@/views/qrInput')
        },
        {
            path: '/goods', // 进件流程-商品分期信息
            name: 'Goods',
            component: () => import('@/views/goods'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/review', // 进件流程-复核页
            name: 'Review',
            component: () => import('@/views/review')
        },
        {
            path: '/bindCard', // 绑卡页
            name: 'BindCard',
            component: () => import('@/views/bindCard'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/customerList', // 客户列表
            name: 'CustomerList',
            component: () => import('@/views/customerList')
        },
        {
            path: '/clientDetail', // 订单详情
            name: 'ClientDetail',
            component: () => import('@/views/clientDetail')
        },
        {
            path: '/consumerInfomation', // 客户信息
            name: 'ConsumerInfomation',
            component: () => import('@/views/consumerInfomation')
        },
        {
            path: '/promoter', // 推广员列表
            name: 'Promoter',
            component: () => import('@/views/promoter')
        },
        {
            path: '/promoterInfo', // 推广员信息列表
            name: 'PromoterInfo',
            component: () => import('@/views/promoterInfo')
        },
        {
            path: '/promoterReward', // 推广员奖励发放
            name: 'PromoterReward',
            component: () => import('@/views/promoterReward')
        },
        {
            path: '/promoterInfoList', // 推广员信息详情页
            name: 'PromoterInfoList',
            component: () => import('@/views/promoterInfoList')
        },
        {
            path: '/grantList', // 发放列表页
            name: 'GrantList',
            component: () => import('@/views/grantList.vue')
        },
        {
            path: '/addPromoter', // 添加推广员
            name: 'AddPromoter',
            component: () => import('@/views/addPromoter.vue')
        },
        {
            path: '/agreementDetails', // 协议详情
            name: 'agreementDetails',
            component: () => import('@/views/agreementDetails.vue')
        },
        {
            path: '/loginFailed', // 登录失败
            name: 'loginFailed',
            component: () => import('@/views/loginFailed.vue')
        },
        {
            path: '/goldActivityPage', // 活动页
            name: 'GoldActivityPage',
            component: () => import('@/views/goldActivityPage.vue')
        },
        {
            path: '/resultPage', // 活动页
            name: 'ResultPage',
            component: () => import('@/views/resultPage.vue')
        },
        {
            path: '/test', // 活动页
            name: 'Test',
            component: () => import('@/views/test/index.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    sessionStorage.setItem('routeName', to.name);
    sessionStorage.setItem('fromName', from.name);
    next();
});

export default router;
