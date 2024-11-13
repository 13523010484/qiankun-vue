import { defineConfig } from 'umi';

export default defineConfig({
  layout: {},
  qiankun: {
    slave: {},
  },
  antd: {},
  routes: [
    {
      path: '/',
      component: '@/pages/index',
    },
  ],
});
