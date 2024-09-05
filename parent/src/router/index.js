import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import MicroApp from "../components/MicroApp.vue";

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
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
<<<<<<< Updated upstream
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
=======
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    // path: '/child-app1',// 修改前
    path: "/child-app1/*", // 修改后
    name: "MicroApp",
    component: MicroApp,
  },
  {
    // path: '/child-app1',// 修改前
    path: "/sub-app-react", // 修改后
    name: "MicroApp",
>>>>>>> Stashed changes
    component: MicroApp,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
