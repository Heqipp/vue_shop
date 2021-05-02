import Vue from 'vue'

import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
//提示弹框
import {message} from 'element-ui'


Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
//将提示弹框挂载到全局使用
Vue.prototype.$message=message
