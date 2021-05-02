import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//引入阿里图标
import './assets/img/user/iconfont.css'
import  './assets/img/password/iconfont.css'

import axios from 'axios'
//配置axios请求
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http=axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
