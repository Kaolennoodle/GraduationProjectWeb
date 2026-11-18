<template>
  <div class="booking-page">
    <section class="booking-intro">
      <h2>查找教室</h2>
      <p>选择一间教室和使用时段。提交后，教室管理员会审核你的申请。</p>
    </section>
    <form class="room-filter" @submit.prevent="search">
      <label>教室名称<el-input v-model="filters.c_name" placeholder="例如 A101" clearable /></label>
      <label>最少座位<el-input-number v-model="filters.c_volume" :min="1" :controls="false" placeholder="不限" /></label>
      <label>教学楼<el-input v-model="filters.c_building" placeholder="不限" clearable /></label>
      <label>楼层<el-input v-model="filters.c_floor" placeholder="不限" clearable /></label>
      <label>地址<el-input v-model="filters.c_address" placeholder="不限" clearable /></label>
      <div class="filter-actions">
        <el-button type="primary" native-type="submit">搜索</el-button>
        <el-button @click="reset">清空</el-button>
      </div>
    </form>

    <section v-loading="loading" aria-label="教室列表" class="room-list">
      <p v-if="loadError" role="alert">{{ loadError }}</p>
      <el-empty v-else-if="!loading && !rooms.length" description="没有符合条件的教室" />
      <div v-else class="room-grid">
        <article v-for="room in rooms" :key="room.cid" class="room">
          <span class="room-icon"><OfficeBuilding /></span>
          <h3>{{ room.cname }}</h3>
          <p>{{ room.caddress || [room.cbuilding, room.cfloor].filter(Boolean).join(' · ') || '地址待补充' }}</p>
          <div class="room-footer">
            <span>{{ room.cvolume }} 个座位</span>
            <el-button :disabled="!room.cadminId" :type="room.cadminId ? 'primary' : 'default'" @click="selectRoom(room)">
              {{ room.cadminId ? '预约' : '暂不可预约' }}
            </el-button>
          </div>
        </article>
      </div>
      <el-pagination v-if="total > pageSize" v-model:current-page="page" :page-size="pageSize"
                     :total="total" layout="prev, pager, next" @current-change="loadRooms" />
    </section>

    <el-dialog v-model="dialog" title="申请教室预约" width="530px">
      <form v-if="selected" id="booking-form" class="booking-form" @submit.prevent="submit">
        <h3>{{ selected.cname }}</h3>
        <label>预约日期
          <el-date-picker v-model="day" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" :disabled-date="isPastDay" />
        </label>
        <div class="booking-times">
          <label>开始时间<el-time-picker v-model="start" format="HH:mm" value-format="HH:mm" :disabled="!day" /></label>
          <label>结束时间<el-time-picker v-model="end" format="HH:mm" value-format="HH:mm" :disabled="!day" /></label>
        </div>
        <div v-if="day" class="availability" role="status">
          <strong>当日占用 · 北京时间</strong>
          <p v-if="checking">正在查询时段…</p>
          <p v-else-if="availabilityError">{{ availabilityError }}</p>
          <p v-else-if="!slots.length">当天暂无占用时段</p>
          <ul v-else>
            <li v-for="slot in slots" :key="slot.startTime">{{ timeLabel(slot.startTime) }}–{{ timeLabel(slot.endTime) }}</li>
          </ul>
        </div>
        <p v-if="submitError" role="alert" class="booking-error">{{ submitError }}</p>
      </form>
      <template #footer>
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" native-type="submit" form="booking-form" :loading="submitting"
                   :disabled="!day || !start || !end">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import request from '@/utils/request'
import type { ApiResponse, PageResult } from '@/types'

interface Room {
  cid: number
  cname: string
  cvolume: number
  cbuilding?: string
  cfloor?: string
  caddress?: string
  cadminId?: number
}
interface BusySlot { startTime: string; endTime: string }

const router = useRouter()
const filters = reactive({ c_name: '', c_volume: undefined as number | undefined, c_building: '', c_floor: '', c_address: '' })
const page = ref(1)
const pageSize = 12
const total = ref(0)
const rooms = ref<Room[]>([])
const loading = ref(false)
const loadError = ref('')
const selected = ref<Room>()
const dialog = ref(false)
const day = ref('')
const start = ref('')
const end = ref('')
const checking = ref(false)
const slots = ref<BusySlot[]>([])
const availabilityError = ref('')
const submitError = ref('')
const submitting = ref(false)
let roomRequest = 0
const dateFormatter = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' })
const timeFormatter = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Shanghai' })
const timeLabel = (value: string) => timeFormatter.format(new Date(value))

function isPastDay(candidate: Date) {
  const localDay = [candidate.getFullYear(), candidate.getMonth() + 1, candidate.getDate()]
    .map(value => String(value).padStart(2, '0')).join('-')
  return localDay < dateFormatter.format()
}

async function loadRooms() {
  const version = ++roomRequest
  loading.value = true
  loadError.value = ''
  try {
    const result = await request.get<unknown, PageResult<Room>>('/classroom/page', {
      params: { pageNum: page.value, pageSize, ...filters },
    })
    if (!Array.isArray(result.records)) throw new Error('Invalid classroom response')
    if (version !== roomRequest) return
    rooms.value = result.records
    total.value = result.total
  } catch {
    if (version === roomRequest) loadError.value = '暂时无法加载教室，请重新搜索。'
  } finally {
    if (version === roomRequest) loading.value = false
  }
}

function search() {
  page.value = 1
  void loadRooms()
}

function reset() {
  Object.assign(filters, { c_name: '', c_volume: undefined, c_building: '', c_floor: '', c_address: '' })
  search()
}

function selectRoom(room: Room) {
  selected.value = room
  day.value = start.value = end.value = submitError.value = ''
  dialog.value = true
}

watch([selected, day, dialog], async ([room, date, open], _, onCleanup) => {
  slots.value = []
  checking.value = false
  availabilityError.value = ''
  if (!room || !date || !open) return
  const abort = new AbortController()
  onCleanup(() => abort.abort())
  checking.value = true
  try {
    const result = await request.get<unknown, ApiResponse<BusySlot[]>>('/appointment/availability', {
      params: { cid: room.cid, date }, signal: abort.signal,
    })
    if (abort.signal.aborted) return
    if (result.code !== '200') availabilityError.value = result.msg
    else slots.value = result.data
  } catch {
    if (!abort.signal.aborted) availabilityError.value = '暂时无法查询时段，提交时会再次校验。'
  } finally {
    if (!abort.signal.aborted) checking.value = false
  }
})

async function submit() {
  if (!selected.value || !day.value || !start.value || !end.value || submitting.value) return
  submitError.value = ''
  if (start.value >= end.value) {
    submitError.value = '结束时间须晚于开始时间。'
    return
  }
  submitting.value = true
  try {
    const result = await request.post<unknown, ApiResponse>('/appointment/new', undefined, {
      params: { cid: selected.value.cid, date: day.value, startTime: start.value, endTime: end.value },
    })
    if (result.code !== '200') {
      submitError.value = result.msg
      return
    }
    dialog.value = false
    ElMessage.success('预约申请已提交')
    await router.push('/user/my-appointment')
  } catch {
    submitError.value = '提交失败，请稍后再试。'
  } finally {
    submitting.value = false
  }
}

onMounted(loadRooms)
</script>

<style scoped>
.booking-page { display: grid; gap: 20px; }
.booking-intro h2 { font-size: 27px; margin-bottom: 7px; }
.booking-intro p, .room p, .room-footer span { color: var(--text-muted); font-size: 14px; line-height: 1.6; }
.room-filter, .room { background: white; border: 1px solid var(--surface-border); border-radius: 14px; padding: 17px; }
.room-filter { display: grid; grid-template-columns: 1.1fr repeat(4, .8fr) auto; gap: 12px; align-items: end; }
.room-filter label, .booking-form label { display: grid; gap: 6px; font-size: 13px; color: #344861; }
.room-filter :deep(.el-input-number) { width: 100%; }
.filter-actions { white-space: nowrap; }
.room-filter :deep(.el-input__wrapper), .filter-actions .el-button, .room-footer .el-button { min-height: 34px; }
.room-list { min-height: 120px; display: grid; gap: 16px; }
.room-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 235px), 1fr)); gap: 14px; }
.room { display: grid; gap: 8px; }
.room-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 10px; color: var(--brand); background: #eaf0ff; margin-bottom: 6px; }
.room-icon svg { width: 21px; }
.room h3 { font-size: 16px; }
.room-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 10px; border-top: 1px solid var(--surface-border); }
.booking-form { display: grid; gap: 14px; }
.booking-times { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.booking-form :deep(.el-date-editor) { width: 100%; }
.availability { border-radius: 10px; padding: 10px 12px; background: #f1f5ff; line-height: 1.7; }
.availability ul { display: flex; flex-wrap: wrap; gap: 6px 20px; padding-left: 17px; margin: 0; }
.booking-error { color: #a22d23; }
@media (max-width: 970px) { .room-filter { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
