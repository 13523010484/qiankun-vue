const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        /**
         * 1、问题：主应用访问 antd-umi-pro 子应用的表格接口 /api/v1/queryUserList 报404错误
         * 2、解决方法：在主应用中配置代理转发到子应用的接口域名
         * 3、修改完配置之后重启项目
         * **/
        target: 'http://192.168.6.103:8000',
        changeOrigin: true,
        pathRewrite: {
          '/api': '/api',
        },
      },
    },
  },
});
