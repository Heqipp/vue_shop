import Vue from 'vue'
// import Login from './components/Login.vue'
const Login = () =>
  import ( /* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from './components/Home.vue'
const Home = () =>
  import ( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () =>
  import ( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from './components/user/Users.vue'
const Users = () =>
  import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () =>
  import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () =>
  import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () =>
  import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () =>
  import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// import GoodsList from './components/goods/List.vue'
const List = () =>
  import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')

// import Add from './components/goods/Add.vue'
const Add = () =>
  import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () =>
  import ( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
// import Report from './components/report/Report.vue'
const Report = () =>
  import ( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome', //重定向到欢迎页面
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path:'/rights', component: Rights },
      { path:'/roles', component: Roles },
      { path:'/categories', component: Cate },
      {path:'/params',component: Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component: Order},
      {path:'/reports',component: Report}
    ]
  }
]

const router = new VueRouter({
  routes
})
//路由导航守卫：作用：在没有登录时访问其他页面，需要先登录=跳转到登录页面
//1.在路由对象上 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //2.如果要访问的是登录页面，就直接跳出守卫即可。反之需要判断token的值
  if (to.path == '/login') return next()
  //3.先获取到页面的token值;有可能是空的，因为你还没有登录
  const tokenStr = window.sessionStorage.getItem('token')
  //4.判断：如果没有token值，就跳转到登录页面；反之就跳出守卫
  if (!tokenStr) return next('/login')
  next()
})
export default router
