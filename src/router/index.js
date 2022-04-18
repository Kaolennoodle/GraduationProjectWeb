import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Login',
  //   component: () => import('../views/Login.vue'),
  //   redirect: "/login"
  // },
  {
    path: '/',
    name: 'ManagerInterface',
    component: () => import('../views/ManagerInterface.vue'),
    redirect: "/home",
    children: [
      {path: 'home', name: 'Home', meta: {indexName: "首页"}, component: () => import('../components/Home.vue')},
      {path: 'user', name: 'User', meta: {indexName: "用户管理"}, component: () => import('../components/User.vue')},
      {path: 'settings', name: 'Settings', meta: {indexName: "系统设置"}, component: () => import('../components/Settings.vue')},
      {path: 'log', name: 'Log', meta: {indexName: "使用记录"}, component: () => import('../components/Log.vue')},
      {path: 'classroom', name: 'Classroom', meta: {indexName: "教室管理"}, component: () => import('../components/Classroom.vue')}
    ]
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
