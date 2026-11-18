import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { workspacePath } from './workspaces'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: () => import('@/views/AuthView.vue') },
    { path: '/register', name: 'Register', component: () => import('@/views/AuthView.vue') },
    {
      path: '/user',
      name: 'UserInterface',
      component: () => import('@/views/WorkspaceView.vue'),
      redirect: '/user/home',
      children: [
        { path: 'home', name: 'UserHome', component: () => import('@/components/WorkspaceHome.vue') },
        { path: 'appointment', name: 'UserAppointment', component: () => import('@/components/User/UserAppointment.vue') },
        { path: 'my-appointment', name: 'MyAppointment', component: () => import('@/components/User/MyAppointment.vue') },
        { path: 'message', name: 'UserMessage', component: () => import('@/components/Message.vue') },
      ],
    },
    {
      path: '/manager',
      name: 'ManagerInterface',
      component: () => import('@/views/WorkspaceView.vue'),
      redirect: '/manager/home',
      children: [
        { path: 'home', name: 'ManagerHome', component: () => import('@/components/WorkspaceHome.vue') },
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
      component: () => import('@/views/WorkspaceView.vue'),
      redirect: '/classroom-admin/home',
      children: [
        { path: 'home', name: 'ClassroomAdminHome', component: () => import('@/components/WorkspaceHome.vue') },
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

router.beforeEach((to) => {
  const session = useUserStore()
  const publicRoute = to.path === '/login' || to.path === '/register'
  if (!session.user) return publicRoute ? true : '/login'

  const home = workspacePath(session.user.utype)
  if (publicRoute || to.matched[0]?.path !== home) return home
  return true
})

export default router
