import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import MicroApp from '../components/MicroApp.vue';

Vue.use(VueRouter);

const { isNavigationFailure, NavigationFailureType } = VueRouter;
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((failure) => {
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      throw failure;
    }
  });
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((failure) => {
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      throw failure;
    }
  });
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about/*',
    name: 'about',
    component: AboutView,
  },
  {
    // 子应用1 的路由配置，* 为匹配当前路由下的所有路由
    path: '/child-app1/*',
    name: 'MicroApp',
    component: MicroApp,
  },
  {
    // 子应用2 的路由配置
    path: '/sub-app-react/*',
    name: 'MicroApp',
    component: MicroApp,
  },
  {
    // 子应用2 的路由配置
    path: '/sub-app-react-test/*',
    name: 'MicroApp',
    component: MicroApp,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
