// 动态设置 publicPath
import './public-path';
import Vue from 'vue';
import App from './App.vue';
import routes from './router';
import VueRouter from 'vue-router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);

// 将下面这段代码放置在 main.js 中会产生图片无法正确加载子应用图片的问题，原因子项目的图片转发地址不对，导致无法加载
// 按照文档将这部分代码提到外部文件中，导入到 main.js 中来，确保在 webpack 打包之前设置资源路径
// if (window.__POWERED_BY_QIANKUN__) {
//   /* eslint-disable @typescript-eslint/camelcase */
//   __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
// }

let router = null;
let instance = null;
function render(props = {}) {
  console.log('子应用 render props::', props, 'instance====', instance);
  // sessionStorage.setItem('userInfo', JSON.stringify(props.token.userInfo));
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/child-app1/' : '/',
    mode: 'history',
    routes
  });

  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
/* eslint-disable */
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('子应用 bootstrap ===========================');
}

let initialState = null;
export async function mount(props) {
  console.log('子应用 mount props ===============', props);
  sessionStorage.setItem('userInfo', JSON.stringify(props.token.userInfo));
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log('子应用获取共享数据 state::', state, 'prev::', prev);
    // 接收主应用中的共享数据 并将其设置为全局变量
    Vue.prototype.$initialState = state;
  });
  props.setGlobalState({
    initialState:
      '子应用中修改主应用中的全局变量，实现住应用子应用间数据的双向双向通信'
  });

  render(props);
}
export async function unmount() {
  console.log('子应用 unmount==========');
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
