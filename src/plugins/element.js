import Vue from 'vue'

import {
  Button ,
  Form,
  FormItem ,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Select,
  Option,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree

} from 'element-ui'

Vue.use(Table)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use (Breadcrumb)
Vue.use (BreadcrumbItem)
Vue.use (Card)
Vue.use (Select)
Vue.use (Option)
Vue.use (Row)
Vue.use (Col)
//将提示弹框挂载到全局使用
Vue.prototype.$message=Message
//弹框
Vue.prototype.$confirm=MessageBox.confirm
