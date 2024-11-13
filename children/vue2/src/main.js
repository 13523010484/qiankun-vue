// 动态设置 publicPath
import './public-path';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;
function render(props = {}) {
  console.log('子应用 render props::', props, 'instance====', instance);
  // sessionStorage.setItem('userInfo', JSON.stringify(props.token.userInfo));
  const { container } = props;

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
}
