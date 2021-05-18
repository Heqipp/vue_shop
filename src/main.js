import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//引入多个阿里图标
import './assets/css/font_2533627_6b57t1hwb0g/iconfont.css'
//引入阿里图标
import './assets/css/user/iconfont.css'
import  './assets/css/password/iconfont.css'
//树状表格插件引入
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置axios请求
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 设置请求拦截器：
// 为https的请求头添加上token令牌，这样才能获取到需要授权的数据
axios.interceptors.request.use(config => {
  NProgress.start()//请求过程前显示进度条：nprogress
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config//拦截后，对请求操作完必须将其返还
})
//拦截器完成行为后：隐藏进度条
axios.interceptors.response.use(config =>{
  NProgress.done()
  return config
})
//挂载在Vue的原型上，全局使用
Vue.prototype.$http=axios

Vue.config.productionTip = false
//将树状表格注册为全局
Vue.component('tree-table',TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

//格式化后台的时间形式
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
