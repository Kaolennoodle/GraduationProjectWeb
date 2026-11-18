<template>
  <div class="workspace">
    <aside class="workspace-sidebar">
      <RouterLink :to="base + '/home'" class="workspace-brand">
        <span class="brand-mark"><OfficeBuilding /></span>
        <span>蓝星智能教室<small>{{ workspace.role }}</small></span>
      </RouterLink>
      <nav aria-label="工作台导航">
        <RouterLink v-for="item in workspace.items" :key="item.path" :to="base + '/' + item.path">
          <component :is="item.icon" />
          <span>{{ item.title }}</span>
        </RouterLink>
      </nav>
      <div class="workspace-account">
        <el-dropdown trigger="click" @command="accountAction">
          <button type="button" class="account-trigger">
            <el-avatar :size="36" :src="session.user?.uavatarPath">{{ accountName.slice(0, 1) }}</el-avatar>
            <span>{{ accountName }}<small>账号设置</small></span>
            <ArrowDown class="account-arrow" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </aside>
    <div class="workspace-content">
      <header class="workspace-top">
        <h1>{{ title }}</h1>
        <time :datetime="dateISO">{{ dateLabel }}</time>
      </header>
      <main class="workspace-main">
        <router-view :key="route.path" />
      </main>
    </div>
    <AccountDialog v-if="dialog" :mode="dialog" @close="dialog = null" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, OfficeBuilding } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { workspacePath, workspaces } from '@/router/workspaces'
import AccountDialog from '@/components/AccountDialog.vue'

const route = useRoute()
const router = useRouter()
const session = useUserStore()
const dialog = ref<'profile' | 'password' | null>(null)
const base = computed(() => workspacePath(session.userType))
const workspace = computed(() => workspaces[base.value])
const title = computed(() => workspace.value.items.find(item => base.value + '/' + item.path === route.path)?.title ?? '工作台')
const accountName = computed(() => session.user?.unickname || session.user?.uloginName || '我的账号')
const today = new Date()
const dateISO = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(today)
const dateLabel = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Shanghai' }).format(today)

function accountAction(command: string) {
  if (command === 'logout') {
    session.logout()
    void router.replace('/login')
  } else if (command === 'profile' || command === 'password') {
    dialog.value = command
  }
}
</script>

<style scoped>
.workspace { min-height: 100svh; display: grid; grid-template-columns: 238px minmax(0, 1fr); }
.workspace-sidebar { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; gap: 36px; padding: 25px 17px 18px; background: #fff; border-right: 1px solid var(--surface-border); }
.workspace-brand, .account-trigger { display: flex; align-items: center; gap: 10px; padding: 4px 8px; font-weight: 700; white-space: nowrap; }
small { display: block; color: var(--text-muted); font-weight: 500; margin-top: 3px; font-size: 12px; }
nav { display: grid; gap: 5px; }
nav a { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; color: var(--text-muted); font-size: 14px; font-weight: 600; white-space: nowrap; }
nav svg, .account-arrow { width: 18px; height: 18px; flex-shrink: 0; }
nav a:hover { background: #f3f6ff; }
nav .router-link-exact-active { background: #eaf0ff; color: var(--brand); }
.workspace-account { margin-top: auto; padding-top: 15px; border-top: 1px solid var(--surface-border); }
.account-trigger { text-align: left; cursor: pointer; border: 0; border-radius: 10px; color: #14223a; background: transparent; }
.account-trigger:hover { background: #f4f6fb; }
.account-trigger > span:nth-child(2) { max-width: 110px; overflow: hidden; text-overflow: ellipsis; }
.account-arrow { margin-left: 5px; color: var(--text-muted); }
.workspace-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px clamp(16px, 3.6vw, 50px); min-height: 72px; background: #fff; border-bottom: 1px solid var(--surface-border); }
.workspace-top h1 { font-size: 20px; }
.workspace-top time { color: var(--text-muted); font-size: 13px; }
.workspace-main { max-width: 1510px; margin: 0 auto; padding: clamp(16px, 3.6vw, 50px); min-width: 0; }
.workspace-main :deep(.el-pagination) { flex-wrap: wrap; }
.workspace-main :deep(.el-table) { --el-table-header-bg-color: #eef3fb; --el-table-header-text-color: #344861; border-radius: 12px; }
.workspace-main :deep(.el-breadcrumb) { display: none; }
@media (max-width: 760px) {
  .workspace { display: block; }
  .workspace-sidebar { position: static; height: auto; padding: 13px 14px 8px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; border-right: 0; border-bottom: 1px solid var(--surface-border); }
  nav { grid-row: 2; grid-column: 1 / -1; display: flex; flex-wrap: wrap; padding: 3px; }
  nav a { padding: 8px; min-height: 38px; gap: 5px; font-size: 13px; }
  nav svg { width: 15px; height: 15px; }
  .workspace-account { border-top: 0; padding: 0; margin: 0; }
  .account-trigger > span:nth-child(2) { display: none; }
  .workspace-top { min-height: 58px; padding-block: 12px; }
}
</style>
