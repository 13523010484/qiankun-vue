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
          <!-- 方式一、通过 history.pushState() 方式跳转；方式三、子应用之间通过 location.href 跳转 -->
          <el-button type="text" @click="handleJumpChildVue"
            >子应用 vue</el-button
          >
          <!-- 方式二、子应用之间通过标签进行跳转 -->
          <!-- <a href="/child-app1/">子应用 vue</a> -->
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <!-- 方式一、通过 history.pushState() 方式跳转；方式三、子应用之间通过 location.href 跳转 -->
          <el-button type="text" @click="handleJumpChildReact"
            >子应用 react</el-button
          >
          <!-- 方式二、子应用之间通过标签进行跳转 -->
          <!-- <a href="/sub-app-react/">子应用 react</a> -->
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 可以不写，写了之后未指定了子应用挂载位置 -->
      <div id="container-sub-app"></div>
      <div v-for="item in messages" :key="item.id">
        {{ item.value }}
      </div>
      <el-form :inline="true">
        <el-form-item label="消息：">
          <el-input v-model="newMessage" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </el-form-item>
      </el-form>
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
    return {
      messages: [],
      newMessage: '',
      socket: null,
    };
  },

  created() {
    // this.initializeWebSocketConnection();
  },
  beforeDestroy() {
    // if (this.socket) {
    //   this.socket.close();
    // }
  },
  methods: {
    initializeWebSocketConnection() {
      this.socket = new WebSocket('ws://localhost:8083'); // 你的WebSocket服务器地址
      // this.socket = new WebSocket('ws://192.168.6.102:9001'); // 你的WebSocket服务器地址

      this.socket.onopen = () => {
        console.log('WebSocket connection opened');
        // 连接打开后，你可以选择发送一条消息或者进行身份验证等
        this.socket.send(
          JSON.stringify({
            value: this.newMessage,
          })
        );
      };

      this.socket.onmessage = (event) => {
        console.log('接收服务器传过来的 event.data::', event.data);
        const res = JSON.parse(event.data);
        // 接收到服务器发来的消息
        this.messages.push(res.data);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    },

    sendMessage() {
      // console.log('sendMessage this.socket::', this.socket);
      // if (this.socket.readyState === WebSocket.OPEN) {
      //   this.socket.send(
      //     JSON.stringify({
      //       value: this.newMessage,
      //     })
      //   );
      //   this.newMessage = '';
      // } else {
      //   console.error('Cannot send message, the socket is not open.');
      // }
    },

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

    handleJumpChildVue() {
      // 在主应用当中，先跳转到第一个子应用中，再跳转到第二个子应用时，显示的仍然是第一个子应用
      // 原因，在跳转到第二个子应用时，第二个子应用的生命周期函数未执行
      // this.$router.push({
      //   path: '/child-app1/',
      // });
      // 可以解决上面路由跳转的问题
      window.location.href = '/child-app1/';
    },

    handleJumpChildReact() {
      // 在主应用当中，先跳转到第一个子应用中，再跳转到第二个子应用时，显示的仍然是第一个子应用
      // 原因，在跳转到第二个子应用时，第二个子应用的生命周期函数未执行
      // this.$router.push({
      //   path: '/sub-app-react/',
      // });
      // 可以解决上面路由跳转的问题
      window.location.href = '/sub-app-react/';
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
