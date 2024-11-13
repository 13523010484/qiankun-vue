<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <button @click="handleJumpChildApp1" style="width: 90px; height: 60px; line-height: 60px">
    子项目
  </button>
  <!-- 可以不写，写了之后未指定了子应用挂载位置 -->
  <div id="container-sub-app"></div>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { loadMicroApp, setDefaultMountApp } from 'qiankun'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  console.log(`the component is now mounted.`)
})

// 手动加载微应用
const loadMicroAppFn = () => {
  loadMicroApp({
    name: 'childApp1',
    entry: '//localhost:8081/child-app1/',
    container: '#container-child-app1',
    activeRule: '/child-app1',
    props: {
      token: {
        userInfo: {
          userName: '小明',
          userId: '123',
          date: new Date().toLocaleString()
        }
      }
    }
  })
  setDefaultMountApp('/child-app1')
}

const handleJumpChildApp1 = () => {
  router.push({
    path: '/child-app1'
  })
  // 进入微应用时 重新加载微应用
  loadMicroAppFn()
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
