<template>
  <div id="app">
    <!-- <div>
      <p>当前加载的是子系统页面...</p>
      <p>获取平台的登录用户，登录时间</p>
      <p>登录用户：{{ userInfo.userName }}</p>
      <p>登录时间：{{ userInfo.date }}</p>
    </div> -->
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      userInfo: {}
    };
  },
  mounted() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    console.log('this.$initialState::', this.$initialState);
  }
};
</script>

<style lang="scss">
#root {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
