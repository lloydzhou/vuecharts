import { createApp } from 'vue'
import App from './App.vue'
import { install } from '../lib/index'

const app = createApp(App)

// ts模式下会报错vue3支持use直接传递PluginInstallFunction
app.use(install)

app.mount('#app')
