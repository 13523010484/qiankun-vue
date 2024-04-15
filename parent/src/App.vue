<template>
  <div id="app">
    <container-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <el-button type="text" @click="handleJumpParentHome"
            >主应用 home</el-button
          >
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button type="text" @click="handleJumpParentAbout"
            >主应用 about</el-button
          >
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button type="text" @click="handleJumpChildApp1"
            >子应用 home</el-button
          >
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div id="container-child-app1"></div>
    </container-main>
    <router-view />
  </div>
</template>

<script>
import ContainerMain from './components/ContainerMain.vue';
import { loadMicroApp, setDefaultMountApp } from 'qiankun';
import actions from '../actions';

export default {
  name: 'App',
  components: {
    ContainerMain,
  },
  mixins: [actions],
  data() {
    return {
      microApp: null,
    };
  },

  mounted() {
    // this.loadMicroApp();
  },

  methods: {
    // 手动加载微应用
    loadMicroApp() {
      this.microApp = loadMicroApp({
        name: 'childApp1',
        entry: '//localhost:8081/child-app1/',
        container: '#container-child-app1',
        activeRule: '/child-app1',
        props: {
          token: {
            userInfo: {
              userName: '小明',
              userId: '123',
              date: new Date().toLocaleString(),
            },
          },
        },
      });
      setDefaultMountApp('/child-app1');
    },

    handleJumpParentHome() {
      // 简单模拟 if 判断的原因 防止重复点击
      if (this.$route.path != '/') {
        this.$router.push({
          path: '/',
        });
        // 离开微应用时 将微应用卸载
        this.microApp.unmount();
      }
    },

    handleJumpParentAbout() {
      // 简单模拟 if 判断的原因 防止重复点击
      if (this.$route.path != '/about') {
        this.$router.push({
          path: '/about',
        });
      }
    },

    handleJumpChildApp1() {
      // 简单模拟 if 判断的原因 防止重复点击
      if (this.$route.path != '/child-app1') {
        this.$router.push({
          path: '/child-app1',
        });
        // 进入微应用时 重新加载微应用
        this.loadMicroApp();
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
