<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/classroom-admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
      <el-breadcrumb-item>现存预约</el-breadcrumb-item>
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

    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="confirmBatchDel" :disabled="batchDelDisabled">批量删除</el-button>
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
      <el-table-column prop="astatus" label="审核状态" width="75px" header-align="center" align="center">
        <template #default="scope">
          <el-tag :type="getApprovalTagType(scope.row.aapprovalStatus)">
            {{ getLabel(getApprovalType, scope.row.aapprovalStatus, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="172" header-align="center" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">查看详情</el-button>
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

    <el-dialog title="预约详情" v-model="dialogFormVisible">
      <el-alert v-show="!rowEditable" title="预约时间已过，您不能在此修改信息。如有需要，可以删除本次预约重新预约。" type="warning" show-icon></el-alert>
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
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>预约日期</h4>
        <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            style="margin-top: 15px"
            value-format="YYYY-MM-DD"
            :disabled="true">
        </el-date-picker>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>预约时间</h4>
        <el-form :inline="true" style="margin-top: 10px">
          <el-form-item label="开始时间">
            <el-input v-model="form.astartTime" style="width: 125px" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="结束时间" style="margin-left: 20px">
            <el-input v-model="form.aendTime" style="width: 125px" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <template #footer>
        <el-button type="primary" @click="handleDialogCancel">确 定</el-button>
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
  name: 'ClassroomAdminAppointment',
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
      getApprovalType: [
        { dictValue: 1, dictLabel: '待审核' },
        { dictValue: 2, dictLabel: '已通过' },
        { dictValue: 3, dictLabel: '已拒绝' }
      ]
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
    getApprovalTagType(astatus) {
      if (astatus === 1) return 'warning'
      if (astatus === 2) return 'success'
      if (astatus === 3) return 'danger'
      return ''
    },
    tableRowClassName({ row }) {
      if (row.aapprovalStatus === 1 || row.astatus === 2) return 'warning-row'
      if (row.aapprovalStatus === 3) return 'error-row'
      if (row.aapprovalStatus === 2 && row.astatus === 1) return 'success-row'
      if (row.astatus === 3) return 'info-row'
      return ''
    },
    handleFilterStartTimeChange() {
      this.endTimeOptions.selectableRange = this.a_start_time + ' - 22:30:00'
    }
  }
}
</script>

<style scoped></style>
