const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: '/',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port: '8088'
  },
  configureWebpack: {
    output: {
      /**
       {
          name: 'childApp1',
          entry: '//localhost:8081/child-app1/',
          container: '#container-sub-app',
          activeRule: '/child-app1',
        },

        library 与 主应用中的 name 保持一致
       **/
      library: `childApp1`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      chunkLoadingGlobal: `webpackJsonp_childApp1` // webpack 5 需要把 jsonpFunction 替换成 chunkLoadingGlobal
    }
  }
});
