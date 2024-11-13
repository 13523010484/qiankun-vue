import { defineConfig } from '@umijs/max';

export default defineConfig({
  /*
    1、微应用加 publicPath、qiankun 属性
    2、publicPath 的值和主应用配置保持一致
    3、主应用配置如下：
    {
      name: 'subAppReact',
      entry: '//localhost:8000/sub-app-react/',
      container: '#container-sub-app',
      activeRule: '/sub-app-react',
    },
  */
  publicPath: '/sub-app-react/',
  qiankun: {
    slave: {},
  },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'yarn',
});
