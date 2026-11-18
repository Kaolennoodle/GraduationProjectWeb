import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'

const request = axios.create({ baseURL: '/api', timeout: 10000 })

request.interceptors.request.use(config => {
  const token = useUserStore().token
  if (token) config.headers.set('token', token)
  return config
})

function expireSession(token: unknown) {
  const session = useUserStore()
  if (!session.token || token !== session.token) return
  session.logout()
  ElMessage.warning('登录已过期，请重新登录')
  void router.replace('/login')
}

request.interceptors.response.use(
  response => {
    if (response.data?.code === '401') expireSession(response.config.headers.get('token'))
    return response.data
  },
  error => {
    if (axios.isCancel(error)) return Promise.reject(error)
    if (error.response?.status === 401) expireSession(error.config?.headers?.get('token'))
    else ElMessage.error(error.response?.data?.msg || '请求失败，请稍后重试')
    return Promise.reject(error)
  }
)

export default request
