<template>
  <el-dialog :model-value="true" :title="mode === 'profile' ? '个人信息' : '修改密码'" width="500px"
             @update:model-value="emit('close')">
    <form id="account-form" v-loading="loading" class="account-form" @submit.prevent="save">
      <template v-if="mode === 'profile'">
        <el-upload action="/api/file/upload" :headers="{ token: session.token }" :show-file-list="false"
                   accept="image/png,image/jpeg,image/webp" :on-success="avatarUploaded" :on-error="avatarFailed" :before-upload="checkAvatar">
          <el-avatar :size="55" :src="profile.uavatarPath">{{ (profile.unickname || '蓝').slice(0, 1) }}</el-avatar>
          <span class="upload-label">更换头像</span>
        </el-upload>
        <label v-for="field in fields" :key="field.key">
          {{ field.label }}
          <el-input v-model="profile[field.key]" />
        </label>
      </template>
      <template v-else>
        <label>旧密码<el-input v-model="oldPassword" type="password" autocomplete="current-password" show-password /></label>
        <label>新密码<el-input v-model="newPassword" type="password" autocomplete="new-password" show-password /></label>
      </template>
      <p v-if="error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" native-type="submit" form="account-form" :loading="saving" :disabled="loading || !ready">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import type { ApiResponse } from '@/types'

const props = defineProps<{ mode: 'profile' | 'password' }>()
const emit = defineEmits<{ (event: 'close'): void }>()
const session = useUserStore()
const router = useRouter()
const fields = [
  { key: 'unickname', label: '昵称' }, { key: 'uname', label: '姓名' },
  { key: 'ustuNum', label: '学号' }, { key: 'uphone', label: '电话' },
  { key: 'uemail', label: '邮箱' }, { key: 'uloginName', label: '登录账号' },
] as const
const profile = reactive({ unickname: '', uname: '', ustuNum: '', uphone: '', uemail: '', uloginName: '', uavatarPath: '' })
const oldPassword = ref('')
const newPassword = ref('')
const loading = ref(false)
const ready = ref(props.mode === 'password')
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  if (props.mode !== 'profile') return
  loading.value = true
  try {
    const result = await request.get<unknown, ApiResponse<typeof profile>>('/user/me')
    if (result.code !== '200') { error.value = result.msg; return }
    for (const { key } of fields) profile[key] = result.data[key] ?? ''
    profile.uavatarPath = result.data.uavatarPath ?? ''
    ready.value = true
  } catch {
    error.value = '个人信息加载失败。'
  } finally {
    loading.value = false
  }
})

function checkAvatar(file: File) {
  error.value = ''
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
    error.value = '请选择不超过 2 MB 的 JPG、PNG 或 WebP 图片。'
    return false
  }
  return true
}

function avatarFailed() {
  error.value = '头像上传失败。'
}

function avatarUploaded(url: unknown) {
  if (typeof url === 'string') profile.uavatarPath = url
  else error.value = '头像上传失败。'
}

async function save() {
  if (!ready.value || saving.value) return
  error.value = ''
  if (props.mode === 'password' && (!oldPassword.value || newPassword.value.length < 8 || newPassword.value.length > 20)) {
    error.value = '请输入旧密码，新密码须为 8 至 20 个字符。'
    return
  }
  saving.value = true
  try {
    const result = props.mode === 'profile'
      ? await request.put<unknown, ApiResponse>('/user/me', profile)
      : await request.post<unknown, ApiResponse>('/user/change-password', {
        oldPassword: oldPassword.value, newPassword: newPassword.value,
      })
    if (result.code !== '200') { error.value = result.msg; return }
    if (props.mode === 'profile') {
      session.setUser({ ...session.user, unickname: profile.unickname, uavatarPath: profile.uavatarPath, uloginName: profile.uloginName })
      ElMessage.success('个人信息已保存')
    } else {
      session.logout()
      await router.replace('/login')
      ElMessage.success('密码已修改，请重新登录')
    }
    emit('close')
  } catch {
    error.value = '保存失败，请稍后重试。'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.account-form { display: grid; gap: 12px; }
.account-form label { display: grid; gap: 6px; }
.account-form p { color: #ac332a; }
.upload-label { margin-left: 11px; color: var(--brand); }
</style>
