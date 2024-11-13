import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
];

const router = new VueRouter({
  // mode: 'history',
<<<<<<< HEAD:children/vue2/src/router/index.js
  // base: process.env.BASE_URL,
  base: window.__POWERED_BY_QIANKUN__ ? '/child-app2/' : '/',
=======
>>>>>>> 25f8e5dd2736587f3abd1552297cb193336e9e47:children/src/router/index.js
  routes
});

export default router;
