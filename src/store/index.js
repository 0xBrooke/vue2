import Vue from 'vue';
import Vuex from 'vuex';
// import state from './state';
/* 在组件内通过commit调用mutations的方法改变store的状态，同时各组件都会跟着变化 */
import * as types from './mutation-types';
// import actions from './actions';
import persistedState from 'vuex-persistedstate';
// import { YK_JSBridge } from '../assets/js/JSBride.js';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    /* 定义数据源 */
    state: {
        // saCode: '10299309', // 临时初始值 通过桥接获取
        saCode: '',
        showLoading: false,
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
        token: sessionStorage.getItem('token') || '',
        faceToken: sessionStorage.getItem('faceToken') || '',
        memeber: {},
        isModify: false, //是否可以修改
        isOther: true, // 判断其他
        keepAlive: ['BindCard']
    },
    /* store的计算属性 根据依赖缓存 只有依赖改变才会被重新计算 */
    getters: {
        /* 工号 业务编号 */
        saCode: state => {
            const saCode = state.saCode;
            return saCode;
        },
        keepAlive: state => {
            return state.keepAlive;
        }
    },
    /* 同步事务 通过store.commit触发 */
    mutations: {
        [types.SHOWLOADING](state, status) {
            state.showLoading = status;
        },
        [types.SETUSERINFO](state, status) {
            state.userInfo = status;
        },
        [types.SETTOKEN](state, status) {
            state.token = status;
        },
        [types.SETFACETOKEN](state, status) {
            state.faceToken = status;
        },
        [types.SETSACODE](state, status) {
            state.saCode = status;
        },
        [types.SETMEMBER](state, status) {
            state.memeber = status;
        },
        [types.ISMODIFY](state, status) {
            state.isModify = status;
        },
        [types.ISOTHER](state, status) {
            state.isOther = status;
        },
        [types.KEEPALIVE](state, status) {
            state.keepAlive = status;
        }
    },
    /* 处理异步操作 通过store.dispatch方法触发 */
    actions: {
        setLoading({ commit }, state) {
            commit(types.SHOWLOADING, state);
        },
        setUserInfo({ commit }, state) {
            commit(types.SETUSERINFO, state);
            sessionStorage.setItem('userInfo', JSON.stringify(state));
        },
        setToken({ commit }, state) {
            commit(types.SETTOKEN, state);
            sessionStorage.setItem('token', state);
        },
        setFaceToken({ commit }, state) {
            commit(types.SETFACETOKEN, state);
            sessionStorage.setItem('faceToken', state);
        },
        setSaCode({ commit }, state) {
            commit(types.SETSACODE, state);
            sessionStorage.setItem('saCOde', state);
        },
        /* 进件列表继续进件数据 */
        setMember({ commit }, state) {
            commit(types.SETMEMBER, state);
        },
        /* 进件列表-复核页是否修改字段 */
        setIsModify({ commit }, state) {
            commit(types.ISMODIFY, state);
        },
        /* 进件列表-其他信息字段 */
        setIsOther({ commit }, state) {
            commit(types.ISOTHER, state);
        },
        /* 路由缓存 */
        setKeepAlive({ commit }, state) {
            commit(types.KEEPALIVE, state);
        }
    },
    plugins: [
        persistedState({
            storage: sessionStorage,
            reducer(val) {
                return {
                    userInfo: val.userInfo // 指定需要持久化的state
                };
            }
        })
    ]
});
