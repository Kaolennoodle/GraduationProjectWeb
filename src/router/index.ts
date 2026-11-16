import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/Register.vue') },
    {
      path: '/user',
      name: 'UserInterface',
      component: () => import('@/views/UserInterface.vue'),
      redirect: '/user/home',
      children: [
        { path: 'home', name: 'UserHome', component: () => import('@/components/User/UserHome.vue') },
        { path: 'appointment', name: 'UserAppointment', component: () => import('@/components/User/UserAppointment.vue') },
        { path: 'my-appointment', name: 'MyAppointment', component: () => import('@/components/User/MyAppointment.vue') },
        { path: 'message', name: 'UserMessage', component: () => import('@/components/Message.vue') },
      ],
    },
    {
      path: '/manager',
      name: 'ManagerInterface',
      component: () => import('@/views/ManagerInterface.vue'),
      redirect: '/manager/home',
      children: [
        { path: 'home', name: 'ManagerHome', component: () => import('@/components/Manager/Home.vue') },
        { path: 'user', name: 'User', component: () => import('@/components/Manager/User.vue') },
        { path: 'classroom', name: 'Classroom', component: () => import('@/components/Manager/Classroom.vue') },
        { path: 'appointment', name: 'ManagerAppointment', component: () => import('@/components/Manager/Appointment.vue') },
        { path: 'settings', name: 'Settings', component: () => import('@/components/Manager/Settings.vue') },
        { path: 'message', name: 'ManagerMessage', component: () => import('@/components/Message.vue') },
      ],
    },
    {
      path: '/classroom-admin',
      name: 'ClassroomAdminView',
      component: () => import('@/views/ClassroomAdminView.vue'),
      redirect: '/classroom-admin/home',
      children: [
        { path: 'home', name: 'ClassroomAdminHome', component: () => import('@/components/ClassroomAdmin/ClassroomAdminHome.vue') },
        { path: 'new-appointment', name: 'ClassroomAdminNewAppointment', component: () => import('@/components/ClassroomAdmin/ClassroomAdminNewAppointment.vue') },
        { path: 'appointment', name: 'ClassroomAdminAppointment', component: () => import('@/components/ClassroomAdmin/ClassroomAdminAppointment.vue') },
        { path: 'classroom-info', name: 'ClassroomAdminClassroomInfo', component: () => import('@/components/ClassroomAdmin/ClassroomAdminClassroomInfo.vue') },
        { path: 'settings', name: 'ClassroomAdminSettings', component: () => import('@/components/ClassroomAdmin/ClassroomAdminSettings.vue') },
        { path: 'message', name: 'ClassroomAdminMessage', component: () => import('@/components/Message.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach((to, _from, next) => {
  const publicPaths = ['/login', '/register']
  const isPublic = publicPaths.includes(to.path)
  const raw = localStorage.getItem('user')
  const isLoggedIn = !!raw

  if (!isPublic && !isLoggedIn) {
    next('/login')
  } else if (isPublic && isLoggedIn) {
    try {
      const user = JSON.parse(raw!)
      if (user.utype === 4) next('/manager')
      else if (user.utype === 3) next('/classroom-admin')
      else next('/user')
    } catch {
      next()
    }
  } else {
    next()
  }
})

export default router
