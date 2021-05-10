import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//引入多个阿里图标
import './assets/css/font_2533627_6b57t1hwb0g/iconfont.css'
//引入阿里图标
import './assets/css/user/iconfont.css'
import  './assets/css/password/iconfont.css'

import axios from 'axios'
//配置axios请求
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 设置请求拦截器：
// 为https的请求头添加上token令牌，这样才能获取到需要授权的数据
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config//拦截后，对请求操作完必须将其返还
})
//挂载在Vue的原型上，全局使用
Vue.prototype.$http=axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
