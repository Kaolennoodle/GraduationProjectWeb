import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/user',
    name: 'UserInterface',
    component: () => import('../views/UserInterface.vue'),
    redirect: '/user/home',
    children: [
      {
        path: 'home',
        name: 'UserHome',
        component: () => import('../components/User/UserHome.vue')
      },
      {
        path: 'appointment',
        name: 'UserAppointment',
        component: () => import('../components/User/UserAppointment')
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('../components/User/UserDashboard')
      }
    ]
  },
  {
    path: '/manager',
    name: 'ManagerInterface',
    component: () => import('../views/ManagerInterface.vue'),
    redirect: '/manager/home',
    children: [
      {path: 'home',
        name: 'Home',
        meta: {indexName: "首页"},
        component: () => import('../components/Manager/Home.vue')},
      {path: 'user',
        name: 'User',
        meta: {indexName: "用户管理"},
        component: () => import('../components/Manager/User.vue')},
      {path: 'settings',
        name: 'Settings',
        meta: {indexName: "系统设置"},
        component: () => import('../components/Manager/Settings.vue')},
      {path: 'log',
        name: 'Log',
        meta: {indexName: "使用记录"},
        component: () => import('../components/Manager/Log.vue')},
      {path: 'classroom',
        name: 'Classroom',
        meta: {indexName: "教室管理"},
        component: () => import('../components/Manager/Classroom.vue')}
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
