import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/CSS/global.css'
// 导入 挂载 axios 插件
import axios from 'axios'
// 设置请求根路径
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
// 设置请求拦截器 为请求头添加token 在挂载之前
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // return config
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
