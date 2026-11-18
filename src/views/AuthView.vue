<template>
  <AuthLayout :title="registering ? '开通你的账号' : '欢迎回来'"
              :description="registering ? '注册后即可查找教室并提交预约。' : '登录你的账号，继续安排教室与预约。'">
    <form class="auth-form" @submit.prevent="submit">
      <label for="login-name">账号</label>
      <el-input id="login-name" v-model="loginName" size="large" autocomplete="username" placeholder="输入你的账号" />
      <label for="password">密码</label>
      <el-input id="password" v-model="password" size="large" type="password" show-password
                :autocomplete="registering ? 'new-password' : 'current-password'" placeholder="输入密码" />
      <template v-if="registering">
        <label for="repeat-password">确认密码</label>
        <el-input id="repeat-password" v-model="repeatPassword" size="large" type="password" show-password
                  autocomplete="new-password" placeholder="再次输入密码" />
      </template>
      <p v-if="notice" class="notice" role="status">{{ notice }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <el-button type="primary" size="large" native-type="submit" :loading="busy">{{ registering ? '创建账号' : '登录' }}</el-button>
    </form>
    <p class="auth-switch">
      {{ registering ? '已有账号？' : '还没有账号？' }}
      <RouterLink :to="registering ? '/login' : '/register'">{{ registering ? '返回登录' : '立即注册' }}</RouterLink>
    </p>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'
import { useUserStore } from '@/stores/user'
import { workspacePath } from '@/router/workspaces'
import request from '@/utils/request'
import type { ApiResponse, User } from '@/types'

const route = useRoute()
const router = useRouter()
const session = useUserStore()
const registering = computed(() => route.path === '/register')
const loginName = ref('')
const password = ref('')
const repeatPassword = ref('')
const busy = ref(false)
const error = ref('')
const notice = ref('')

watch(registering, () => {
  error.value = ''
  password.value = ''
  repeatPassword.value = ''
  if (registering.value) notice.value = ''
})

async function submit() {
  if (busy.value) return
  const isRegistration = registering.value
  error.value = ''
  notice.value = ''
  if (!loginName.value.trim() || !password.value) {
    error.value = '请输入账号和密码。'
    return
  }
  if (isRegistration && (password.value.length < 8 || password.value.length > 20)) {
    error.value = '密码长度须为 8 至 20 个字符。'
    return
  }
  if (isRegistration && password.value !== repeatPassword.value) {
    error.value = '两次输入的密码不一致。'
    return
  }

  busy.value = true
  try {
    const result = await request.post<unknown, ApiResponse<User>>(isRegistration ? '/user/register' : '/login', {
      uloginName: loginName.value.trim(),
      upassword: password.value,
    })
    if (isRegistration !== registering.value) return
    if (result.code !== '200') {
      error.value = result.msg
      return
    }
    if (isRegistration) {
      notice.value = '账号已创建，请登录。'
      await router.replace('/login')
      return
    }
    session.setUser(result.data)
    await router.replace(workspacePath(result.data.utype))
  } catch {
    if (isRegistration === registering.value) error.value = '暂时无法连接服务，请稍后重试。'
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.auth-form { display: grid; gap: 9px; }
label { font-size: 14px; font-weight: 650; }
label:not(:first-child) { margin-top: 10px; }
.auth-form :deep(.el-input__wrapper) { padding: 3px 14px; border-radius: 10px; }
.auth-form .el-button { margin-top: 17px; border-radius: 10px; height: 46px; font-size: 15px; }
.auth-switch { margin-top: 25px; font-size: 14px; color: var(--text-muted); }
.auth-switch a { color: var(--brand); font-weight: 700; }
.notice, .error { padding: 10px 12px; border-radius: 8px; font-size: 14px; background: #ebf7ed; color: #176239; }
.error { background: #fff0ed; color: #982c22; }
</style>
