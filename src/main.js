import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import { featchH5 } from '@/assets/js/request.js';

import {
    Toast,
    Popup,
    Spinner,
    Swipe,
    SwipeItem,
    Loadmore,
    Button,
    MessageBox,
    Search
} from 'mint-ui';

// 引入mint-ui
import 'mint-ui/lib/style.css';

// mint-ui组件按需加载,全局注册
window.Toast = Toast;
window.MessageBox = MessageBox;
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Popup.name, Popup);
Vue.component(Spinner.name, Spinner);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Button.name, Button);
Vue.component(Search.name, Search);
Vue.config.productionTip = false; // 阻止 vue 在启动时生成生产提示

Vue.prototype.$api = featchH5;

new Vue({ router, store, render: h => h(App) }).$mount('#app');

// (function() {
//     document.getElementsByTagName('input').onblur = window.scrollTo(0, 0);
// })();
