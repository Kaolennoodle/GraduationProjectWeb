<template>
  <section v-loading="loading" class="inbox" aria-label="我的消息">
    <header>
      <p>{{ unread ? unread + ' 条未读消息' : '没有未读消息' }}</p>
      <el-button v-if="unread" :loading="updating" @click="mark()">全部已读</el-button>
    </header>
    <p v-if="error" class="inbox-error" role="alert">{{ error }} <el-button text @click="load">重试</el-button></p>
    <el-empty v-else-if="!loading && !messages.length" description="暂无消息" />
    <el-collapse v-else v-model="expanded" accordion>
      <el-collapse-item v-for="message in messages" :key="message.mid" :name="message.mid">
        <template #title>
          <span class="message-heading">
            <strong>{{ message.mtitle }}</strong>
            <el-tag v-if="message.mstatus === 1" type="warning">未读</el-tag>
            <time :datetime="message.mcreateTime">{{ dateFormat.format(new Date(message.mcreateTime)) }}</time>
          </span>
        </template>
        <p class="message-content">{{ message.mcontent }}</p>
        <el-button v-if="message.mstatus === 1" :loading="updating" @click="mark(message.mid)">标为已读</el-button>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'
import type { ApiResponse } from '@/types'

interface InboxMessage { mid: number; mtitle: string; mcontent: string; mstatus: number; mcreateTime: string }

const session = useUserStore()
const messages = ref<InboxMessage[]>([])
const loading = ref(false)
const updating = ref(false)
const error = ref('')
const expanded = ref<number | string>('')
const unread = computed(() => messages.value.filter(message => message.mstatus === 1).length)
const dateFormat = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Shanghai' })

async function load() {
  loading.value = true
  error.value = ''
  try {
    const result = await request.get<unknown, ApiResponse<InboxMessage[]>>('/message/get-by-receiver/' + session.userId)
    if (result.code === '200') messages.value = result.data
    else error.value = result.msg
  } catch {
    error.value = '消息加载失败。'
  } finally {
    loading.value = false
  }
}

async function mark(id?: number) {
  if (updating.value) return
  updating.value = true
  try {
    const result = await request.post<unknown, ApiResponse>(id == null ? '/message/read-all/' + session.userId : '/message/read/' + id)
    if (result.code !== '200') error.value = result.msg
    else messages.value.forEach(message => { if (id == null || message.mid === id) message.mstatus = 2 })
  } catch {
    error.value = '暂时无法更新消息。'
  } finally {
    updating.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.inbox { padding: 19px; border-radius: 14px; border: 1px solid var(--surface-border); background: white; }
.inbox header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.message-heading { flex: 1; display: flex; align-items: center; flex-wrap: wrap; gap: 7px; padding-right: 10px; line-height: 1.4; }
.message-heading time { margin-left: auto; color: var(--text-muted); font-size: 12px; }
.message-content { margin: 4px 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
.inbox-error { color: #a22d23; }
</style>
