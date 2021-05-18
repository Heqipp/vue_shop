import Vue from 'vue'
import App from './App.vue'
import router from './router'

// import './plugins/element.js'
//导入全局样式
import './assets/css/global.css'

//引入多个阿里图标
import './assets/css/font_2533627_6b57t1hwb0g/iconfont.css'
//引入阿里图标
import './assets/css/user/iconfont.css'
import  './assets/css/password/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入对应样式


import Nprogress from 'nprogress'


//展示进度条
//根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config);
  //进度条
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须returnconfig

  return config
})
//响应拦截器
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})



Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
