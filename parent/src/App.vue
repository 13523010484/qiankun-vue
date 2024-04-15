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
        path: '/child-app1',
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
