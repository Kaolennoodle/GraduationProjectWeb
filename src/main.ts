import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import App from './App.vue'
import { useUserStore } from './stores/user'
import router from './router'
import './assets/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
useUserStore(pinia).loadFromStorage()
app.use(router)
app.directive('loading', ElLoading.directive)
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.mount('#app')
