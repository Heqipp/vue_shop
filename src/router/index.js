import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'

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
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path:'/rights',
        component: Rights
      },
      {
        path:'/roles',
        component: Roles
      },
      {
        path:'/categories',
        component: Cate
      }
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
