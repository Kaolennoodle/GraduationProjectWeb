import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import type { ApiResponse } from '@/types'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    const raw = localStorage.getItem('user')
    if (raw) {
      try {
        const user = JSON.parse(raw)
        if (user?.token) {
          config.headers['token'] = user.token
        }
      } catch {}
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ApiResponse
    if (response.config.responseType === 'blob') {
      return response.data
    }
    if (res.code === '401') {
      ElMessage.error(res.msg || '登录已过期，请重新登录')
      router.push('/login')
    }
    return res
  },
  (error) => {
    const msg = error.response?.data?.msg || error.message || '网络错误，请稍后重试'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request
