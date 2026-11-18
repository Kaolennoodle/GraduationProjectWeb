<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/classroom-admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增预约</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="教室名称" v-model="c_name" style="width: 125px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="用户姓名" v-model="u_name" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-date-picker style="margin-right: 5px; margin-top: 5px; width: 130px" v-model="a_date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期"></el-date-picker>
      <el-time-picker v-model="a_start_time" @change="handleFilterStartTimeChange" style="margin-right: 5px; margin-top: 5px; width: 130px" value-format="HH:mm:ss" format="HH:mm" placeholder="开始时间"></el-time-picker>
      <el-time-picker arrow-control v-model="a_end_time" style="margin-right: 5px; margin-top: 5px; width: 130px" value-format="HH:mm:ss" format="HH:mm" placeholder="结束时间"></el-time-picker>
      <el-button type="primary" style="margin-top: 5px" @click="load">搜索</el-button>
      <el-button style="margin-top: 5px" @click="reset">重置</el-button>
    </div>

    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        :row-class-name="tableRowClassName"
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="39"></el-table-column>
      <el-table-column prop="uname" label="用户姓名" width="75" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ustuNum" label="学生学号" width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="cname" label="教室名称" width="75" header-align="center" align="center"></el-table-column>
      <el-table-column prop="adate" label="日期" width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="astartTime" label="开始时间" width="75" header-align="center" align="center"></el-table-column>
      <el-table-column prop="aendTime" label="结束时间" width="75" header-align="center" align="center"></el-table-column>
      <el-table-column prop="astatus" label="时间状态" width="75px" header-align="center" align="center">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.astatus)">
            {{ getLabel(getType, scope.row.astatus, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" header-align="center" align="center">
        <template #default="scope">
          <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="我再想想"
              title="您确定同意这条预约吗？"
              @confirm="handleApprove(scope.row)">
            <template #reference>
              <el-button type="success" plain>同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="拒绝"
              cancel-button-text="我再想想"
              title="您确定拒绝这条预约吗？"
              @confirm="handleReject(scope.row)">
            <template #reference>
              <el-button type="danger" plain>拒绝</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="修改预约" v-model="dialogFormVisible">
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column="2">
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="管理员联系电话">{{ form.cadminPhone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">用户信息</h4>
        <el-descriptions :column="2">
          <el-descriptions-item label="用户姓名">{{ form.uname }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ form.ustuNum }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ form.uphone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ form.uemail }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="!rowEditable">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectReasonDialogVisible" title="拒绝原因" width="30%">
      <el-select v-model="rejectReason" filterable allow-create default-first-option placeholder="请选择或输入">
        <el-option v-for="item in presetRejectReasons" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <template #footer>
        <el-button @click="rejectReasonDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectAppt">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.el-table .warning-row { background: #fff8ee; }
.el-table .error-row { background: #fce9e9; }
.el-table .success-row { background: #f0f9eb; }
</style>

<script>
import request from '@/utils/request'
import * as dateUtils from '@/utils/date'

export default {
  name: 'ClassroomAdminNewAppointment',
  data() {
    return {
      user: {},
      c_name: '',
      u_name: '',
      a_date: '',
      a_start_time: '',
      a_end_time: '',
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      dialogFormVisible: false,
      datePickerDisabled: true,
      timePickerVisible: false,
      selectedDate: '',
      rowEditable: true,
      startTimeOptions: { selectableRange: '10:30:00 - 22:30:00' },
      endTimeOptions: { selectableRange: '8:30:00 - 22:30:00' },
      startTime: '',
      endTime: '',
      tooltipDisabled: true,
      timePickerDisabled: false,
      multipleSelection: [],
      batchDelDisabled: true,
      getType: [
        { dictValue: 1, dictLabel: '已预约' },
        { dictValue: 2, dictLabel: '已开始' },
        { dictValue: 3, dictLabel: '已结束' },
        { dictValue: 4, dictLabel: '已失效' }
      ],
      rejectReasonDialogVisible: false,
      rejectReason: '',
      presetRejectReasons: [
        { value: '当天有其他活动临时占用', label: '当天有其他活动临时占用' },
        { value: '预约时间过长', label: '预约时间过长' },
        { value: '预约时间过短', label: '预约时间过短' },
        { value: '教师设备损坏', label: '教师设备损坏' }
      ],
      rejectingId: ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    loadCurrentUser() {
      this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleDialogCancel() {
      this.dialogFormVisible = false
      this.timePickerVisible = false
      this.datePickerDisabled = true
      this.startTime = ''
      this.endTime = ''
      this.selectedDate = ''
    },
    async handleEdit(row) {
      await request.get('/classroom/' + row.cid).then((res) => {
        row.cvolume = res.cvolume
        row.caddress = res.caddress
        row.cadminId = res.cadminId
      })
      await request.get('/user/phone/' + row.cadminId).then((res) => {
        row.cadminPhone = res
      })
      await request.get('/user/' + row.uid).then((res) => {
        row.uphone = res.uphone
        row.uemail = res.uemail
      })
      this.form = { ...row }
      this.rowEditable = !(this.form.astatus === 2 || this.form.astatus === 3)
      this.selectedDate = this.form.adate
      this.handleDateChange()
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      request.delete('/appointment/' + row.aid).then((res) => {
        if (res) {
          this.$message.success('删除成功！')
          this.load()
        } else {
          this.$message.error('操作失败！请稍后再试')
        }
      })
    },
    delBatch() {
      const a_ids = this.multipleSelection.map((v) => v.aid)
      request.post('/appointment/del/batch', a_ids).then((res) => {
        if (res) {
          this.$message.success('批量删除成功！')
          this.load()
        } else {
          this.$message.error('操作失败！请稍后再试')
        }
      })
    },
    confirmBatchDel() {
      this.$confirm('此操作不可撤销, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBatch()
      }).catch(() => {})
    },
    handleSelectionChange(val) {
      this.batchDelDisabled = val.length === 0
      this.multipleSelection = val
    },
    reset() {
      this.c_name = ''
      this.u_name = ''
      this.a_start_time = ''
      this.a_end_time = ''
      this.a_date = ''
      this.load()
    },
    async load() {
      this.loading = true
      this.loadCurrentUser()
      await request.get('/appointment/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_name: this.u_name,
          c_name: this.c_name,
          c_admin_id: this.user.uid,
          a_approval_status: 1,
          a_date: this.a_date,
          a_start_time: this.a_start_time,
          a_end_time: this.a_end_time
        }
      }).then((res) => {
        if (res.code === '200') {
          const data = res.data.records
          this.total = res.data.total
          for (let i = 0; i < data.length; i++) {
            data[i].adate = dateUtils.campusDay(data[i].astartTime)
            data[i].astartTime = dateUtils.campusTime(data[i].astartTime)
            data[i].aendTime = dateUtils.campusTime(data[i].aendTime)
          }
          this.tableData = data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading = false
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    getLabel(list, id, value, label) {
      if (id !== '' && Array.isArray(list) && list.length !== 0) {
        const found = list.find((item) => item[value] == id)
        return found ? found[label] : id
      }
      return id
    },
    handleDateChange() {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      const todayStr = this.dateFormat(today)
      if (this.selectedDate === todayStr) {
        this.tooltipDisabled = false
        const currentDate = new Date()
        currentDate.setTime(currentDate.getTime() + 1800 * 1000)
        this.startTimeOptions.selectableRange = dateUtils.formatDate(currentDate, 'hh:mm:ss') + ' - 22:30:00'
      } else {
        this.tooltipDisabled = true
        this.startTimeOptions.selectableRange = '8:30:00 - 22:30:00'
      }
    },
    handleStartTimeChange() {
      this.endTimeOptions.selectableRange = dateUtils.formatDate(this.startTime, 'hh:mm:ss') + ' - 22:30:00'
    },
    submit() {
      request.put('/appointment/edit', undefined, {
        params: {
          aid: this.form.aid,
          uid: this.form.uid,
          cid: this.form.cid,
          date: this.selectedDate,
          startTime: this.startTime ? dateUtils.formatDate(this.startTime, 'hh:mm') : '',
          endTime: this.endTime ? dateUtils.formatDate(this.endTime, 'hh:mm') : ''
        }
      }).then((res) => {
        if (res.code === '200') {
          this.dialogFormVisible = false
          this.load()
          this.$message.success('修改成功')
          this.timePickerVisible = false
          this.datePickerDisabled = true
          this.startTime = ''
          this.endTime = ''
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editDate() {
      this.datePickerDisabled = false
    },
    editTime() {
      this.handleDateChange()
      this.timePickerVisible = true
    },
    dateFormat(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    },
    getTagType(astatus) {
      if (astatus === 1) return 'success'
      if (astatus === 2) return 'warning'
      if (astatus === 3 || astatus === 4) return 'info'
      return ''
    },
    tableRowClassName({ row }) {
      if (row.aapprovalStatus === 1 || row.astatus === 2) return 'warning-row'
      if (row.aapprovalStatus === 3) return 'error-row'
      if (row.aapprovalStatus === 2 && row.astatus === 1) return 'success-row'
      if (row.astatus === 3) return 'info-row'
      return ''
    },
    handleApprove(row) {
      request.post('/appointment/approve/' + row.aid).then((res) => {
        if (res.code === '200') {
          this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleReject(row) {
      this.rejectingId = row.aid
      this.rejectReasonDialogVisible = true
    },
    rejectAppt() {
      request.post('/appointment/reject', undefined, {
        params: { rejectReason: this.rejectReason, a_id: this.rejectingId }
      }).then((res) => {
        if (res.code === '200') {
          this.rejectReasonDialogVisible = false
          this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleFilterStartTimeChange() {
      this.endTimeOptions.selectableRange = this.a_start_time + ' - 22:30:00'
    }
  }
}
</script>

<style scoped></style>
