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
      <!-- 可以不写，写了之后未指定了子应用挂载位置 -->
      <div id="container-child-app1"></div>
    </container-main>
    <router-view />
  </div>
</template>

<script>
import ContainerMain from './components/ContainerMain.vue';

export default {
  name: 'App',
  components: {
    ContainerMain,
  },
  data() {
    return {};
  },

  methods: {
    handleJumpParentHome() {
      this.$router.push({
        path: '/',
      });
    },

    handleJumpParentAbout() {
      this.$router.push({
        path: '/about',
      });
    },

    handleJumpChildApp1() {
      this.$router.push({
        // path: '/child-app1',// 修改前
        path: '/child-app1/', // 修改后
      });
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
