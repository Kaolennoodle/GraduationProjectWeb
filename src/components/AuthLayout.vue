<template>
  <main class="auth-layout">
    <aside class="auth-visual" aria-label="校园教室">
      <div class="visual-brand"><span class="brand-mark"><OfficeBuilding /></span> 蓝星智能教室</div>
      <div class="visual-copy">
        <p class="eyebrow">校园空间预约</p>
        <p class="visual-title">让每一间教室<br />都有更好的安排。</p>
        <p>查询空闲教室、提交申请、跟进审核进度。</p>
      </div>
    </aside>
    <section class="auth-content">
      <div class="auth-card">
        <div class="mobile-brand"><span class="brand-mark"><OfficeBuilding /></span> 蓝星智能教室</div>
        <h1>{{ title }}</h1>
        <p class="auth-description">{{ description }}</p>
        <slot />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { OfficeBuilding } from '@element-plus/icons-vue'

defineProps<{ title: string; description: string }>()
</script>

<style scoped>
.auth-layout { min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); background: #fff; }
.auth-visual { isolation: isolate; position: relative; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; padding: clamp(30px, 5vw, 78px); color: #fff; background: #12264a; }
.auth-visual::before { position: absolute; z-index: -1; inset: 0; content: ''; background: linear-gradient(160deg, #0f2146b8, #0a1c3a32 37%, #07172aed 100%), url('/classroom-hero.webp') center / cover; }
.visual-brand, .mobile-brand { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; }
.visual-brand .brand-mark { color: #fff; background: #ffffff26; border: 1px solid #ffffff50; }
.visual-copy { padding: 56px 0 12px; color: #e1ebff; font-size: 16px; line-height: 1.6; }
.eyebrow { font-size: 13px; font-weight: 600; letter-spacing: .18em; }
.visual-title { margin: 16px 0 20px; font-size: clamp(35px, 4.1vw, 66px); font-weight: 750; letter-spacing: -.05em; line-height: 1.24; color: white; }
.auth-content { display: grid; place-items: center; padding: 40px 24px; }
.auth-card { width: min(420px, 100%); }
.mobile-brand { display: none; margin-bottom: 44px; }
h1 { font-size: clamp(32px, 4vw, 44px); letter-spacing: -.045em; margin-bottom: 10px; line-height: 1.2; }
.auth-description { margin-bottom: 30px; color: var(--text-muted); line-height: 1.65; }
@media (max-width: 740px) {
  .auth-layout { display: block; }
  .auth-visual { display: none; }
  .auth-content { min-height: 100svh; }
  .mobile-brand { display: flex; }
}
</style>
