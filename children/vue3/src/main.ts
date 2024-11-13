import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'childApp1',
    entry: '//localhost:8081/child-app1/',
    container: '#container-sub-app',
    activeRule: '/child-app1'
  },
  {
    name: 'subAppReact',
    entry: '//localhost:8000/sub-app-react/',
    container: '#container-sub-app',
    activeRule: '/sub-app-react'
  }
])

start()

app.mount('#app')
