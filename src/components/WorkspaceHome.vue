<template>
  <div class="dashboard">
    <section class="workspace-hero">
      <div>
        <p class="hero-greeting">你好，{{ session.user?.unickname || session.user?.uloginName }}</p>
        <h2>{{ workspace.heading }}</h2>
        <p>{{ workspace.description }}</p>
        <RouterLink class="hero-action" :to="base + '/' + workspace.items[1].path">
          {{ workspace.items[1].title }} <ArrowRight />
        </RouterLink>
      </div>
    </section>

    <section aria-labelledby="overview-title">
      <h2 id="overview-title">工作概览</h2>
      <div class="metric-grid">
        <RouterLink v-for="metric in metrics" :key="metric.title" class="metric" :to="base + '/' + metric.path">
          <span class="metric-icon"><component :is="metric.icon" /></span>
          <span>{{ metric.title }}</span>
          <strong>{{ metric.value === null ? '—' : metric.value }}</strong>
        </RouterLink>
      </div>
      <p v-if="failed" class="dashboard-note" role="status">部分数据暂未加载。<button type="button" @click="load">重试</button></p>
    </section>

    <section aria-labelledby="links-title">
      <h2 id="links-title">快捷入口</h2>
      <div class="shortcut-grid">
        <RouterLink v-for="item in workspace.items.slice(1)" :key="item.path" :to="base + '/' + item.path">
          <component :is="item.icon" />
          {{ item.title }}
          <ArrowRight class="shortcut-arrow" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowRight, Bell, Calendar, Collection, OfficeBuilding, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { workspacePath, workspaces } from '@/router/workspaces'
import request from '@/utils/request'
import type { ApiResponse } from '@/types'

const session = useUserStore()
const base = computed(() => workspacePath(session.userType))
const workspace = computed(() => workspaces[base.value])
const values = ref<Record<string, number>>({})
const failed = ref(false)

const sources = computed(() => {
  const unread = { title: '未读消息', path: 'message', icon: Bell, url: '/message/get-unread-num/' + session.userId }
  if (base.value === '/classroom-admin') {
    return [
      { title: '待审核预约', path: 'new-appointment', icon: Collection, url: '/appointment/page', params: { a_approval_status: 1 } },
      { title: '所管预约', path: 'appointment', icon: Calendar, url: '/appointment/page' },
      unread,
    ]
  }
  if (base.value === '/manager') {
    return [
      { title: '教室总数', path: 'classroom', icon: OfficeBuilding, url: '/classroom/num' },
      { title: '预约总数', path: 'appointment', icon: Calendar, url: '/appointment/all-num' },
      { title: '用户总数', path: 'user', icon: User, url: '/user/num' },
      unread,
    ]
  }
  return [
    { title: '可查找教室', path: 'appointment', icon: OfficeBuilding, url: '/classroom/num' },
    { title: '我的预约', path: 'my-appointment', icon: Calendar, url: '/appointment/page' },
    unread,
  ]
})

const metrics = computed(() => sources.value.map(item => ({ ...item, value: values.value[item.title] ?? null })))

async function load() {
  failed.value = false
  const results = await Promise.allSettled(sources.value.map(async item => {
    const result = await request.get<unknown, ApiResponse<number | { total: number }>>(item.url, {
      params: { pageNum: 1, pageSize: 1, ...item.params },
    })
    if (result.code !== '200') throw new Error(result.msg)
    values.value[item.title] = typeof result.data === 'number' ? result.data : result.data.total
  }))
  failed.value = results.some(result => result.status === 'rejected')
}

onMounted(load)
</script>

<style scoped>
.dashboard { display: grid; gap: 32px; }
.dashboard h2 { font-size: 19px; margin-bottom: 15px; }
.workspace-hero { isolation: isolate; position: relative; overflow: hidden; border-radius: 19px; color: #fff; background: #162c58; padding: clamp(24px, 4vw, 50px); }
.workspace-hero::before { position: absolute; inset: 0; z-index: -1; content: ''; background: linear-gradient(90deg, #12264d 18%, #142e58d8 47%, #12294f4d 100%), url('/classroom-hero.webp') right 44% / cover; }
.hero-greeting { color: #bccfff; font-size: 14px; }
.workspace-hero h2 { margin: 12px 0 10px; font-size: clamp(29px, 4vw, 48px); letter-spacing: -.045em; }
.workspace-hero h2 + p { font-size: 14px; color: #e5edff; line-height: 1.6; max-width: 37ch; }
.hero-action { display: inline-flex; align-items: center; gap: 12px; margin-top: 24px; padding: 10px 14px; border-radius: 9px; background: white; color: #17377f; font-size: 14px; font-weight: 700; }
.hero-action svg, .metric svg, .shortcut-grid svg { width: 18px; height: 18px; }
.metric-grid, .shortcut-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr)); gap: 12px; }
.metric, .shortcut-grid a { background: #fff; border: 1px solid var(--surface-border); border-radius: 13px; }
.metric:hover, .shortcut-grid a:hover { border-color: #a3b5f1; }
.metric { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; padding: 17px; color: var(--text-muted); font-size: 13px; }
.metric-icon { display: grid; place-items: center; width: 34px; height: 34px; color: var(--brand); background: #eaf0ff; border-radius: 10px; }
.metric strong { grid-column: 1 / -1; font-size: 31px; color: #14223a; }
.shortcut-grid a { display: flex; align-items: center; gap: 8px; padding: 14px; font-size: 14px; }
.shortcut-grid svg { color: var(--brand); }
.shortcut-grid .shortcut-arrow { margin-left: auto; color: var(--text-muted); }
.dashboard-note { margin-top: 12px; font-size: 14px; color: var(--text-muted); }
.dashboard-note button { border: 0; background: none; cursor: pointer; color: var(--brand); }
</style>
