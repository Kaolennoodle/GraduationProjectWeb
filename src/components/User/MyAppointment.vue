<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教室预约</el-breadcrumb-item>
      <el-breadcrumb-item>我的预约</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="教室名称" v-model="c_name" style="width: 125px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-date-picker style="margin-right: 5px; margin-top: 5px; width: 130px" v-model="a_date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期"></el-date-picker>
      <el-time-picker v-model="a_start_time" @change="handleFilterStartTimeChange" style="margin-right: 5px; margin-top: 5px; width: 130px" value-format="HH:mm:ss" format="HH:mm" placeholder="开始时间"></el-time-picker>
      <el-time-picker arrow-control v-model="a_end_time" style="margin-right: 5px; margin-top: 5px; width: 130px" value-format="HH:mm:ss" format="HH:mm" placeholder="结束时间"></el-time-picker>
      <el-button type="primary" style="margin-top: 5px" @click="load">搜索</el-button>
      <el-button style="margin-top: 5px" @click="reset">重置</el-button>
    </div>

    <el-table height="500" v-loading="loading" :data="tableData" border :row-class-name="tableRowClassName" style="margin-top: 10px; width: 100%">
      <el-table-column prop="cname" label="教室名称" width="75"></el-table-column>
      <el-table-column prop="adate" label="日期" width="100"></el-table-column>
      <el-table-column prop="astartTime" label="开始时间" width="75"></el-table-column>
      <el-table-column prop="aendTime" label="结束时间" width="75"></el-table-column>
      <el-table-column prop="astatus" label="状态" width="75px">
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
      <el-table-column label="操作" width="172">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="删除"
              cancel-button-text="取消"
              title="该操作无法撤销，确认删除？"
              @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger">删除</el-button>
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

    <el-dialog title="修改预约" v-model:visible="dialogFormVisible">
      <el-alert v-show="appointmentStarted" title="预约已经开始，您不能在此修改信息。如有需要，可以取消本次预约重新预约。" type="warning" show-icon></el-alert>
      <el-alert v-show="appointmentEnded" title="预约已经结束，您不能在此修改信息。如有需要，请重新预约。" type="info" show-icon></el-alert>
      <el-alert v-show="appointmentApproved" title="预约已获批准，如果修改信息则需要重新等待教室管理员审核。" type="warning" show-icon></el-alert>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column="2">
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="教室管理员">{{ form.cadminName }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ form.cadminPhone }}</el-descriptions-item>
        </el-descriptions>
        <el-popover placement="bottom" width="600" v-model:visible="classroomTableVisible" trigger="click">
          <el-table height="200" v-loading="classroomLoading" :data="classroomTableData" border stripe style="margin-top: 10px">
            <el-table-column prop="cname" label="教室名称" width="100" header-align="center" align="center"></el-table-column>
            <el-table-column prop="cvolume" label="容纳人数" width="75" header-align="center" align="center"></el-table-column>
            <el-table-column prop="caddress" label="地址" width="200" header-align="center" align="center"></el-table-column>
            <el-table-column prop="cadminName" label="教室管理员" width="90" header-align="center" align="center">
              <template #default="scope">
                {{ getLabel(getcadMinName, scope.row.cadminId, 'uid', 'uname') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="77" header-align="center" align="center">
              <template #default="scope">
                <el-button type="primary" @click="classroomChange(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding: 10px 0">
            <el-pagination
                @size-change="handleClassroomSizeChange"
                @current-change="handleClassroomCurrentChange"
                :current-page="classroomPageNum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="classroomPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="classroomTotal">
            </el-pagination>
          </div>
          <template #reference>
            <el-button style="margin-top: 10px" :disabled="!rowEditable">修改教室</el-button>
          </template>
        </el-popover>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>预约日期</h4>
        <el-date-picker
            v-model="selectedDate"
            @change="handleDateChange"
            type="date"
            placeholder="选择日期"
            style="margin-top: 15px"
            value-format="YYYY-MM-DD"
            :disabled="datePickerDisabled">
        </el-date-picker>
        <el-button style="margin-left: 10px" @click="editDate" :disabled="!rowEditable">修改日期</el-button>
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
          <el-button @click="editTime" :disabled="!rowEditable">修改时间</el-button>
        </el-form>
        <div v-show="timePickerVisible">
          <h4>修改时间</h4>
          <el-tooltip style="margin-top: 10px" content="您的日期选择为今天，当日期选择为当天时，您最早可以选择半小时后的时间进行预约" placement="bottom" effect="light" :disabled="tooltipDisabled">
            <el-time-picker style="margin-right: 5px" placeholder="起始时间" v-model="startTime" @change="handleStartTimeChange" format="HH:mm" :disabled="timePickerDisabled"></el-time-picker>
          </el-tooltip>
          <el-time-picker placeholder="结束时间" v-model="endTime" format="HH:mm" :disabled="timePickerDisabled"></el-time-picker>
        </div>
      </el-card>
      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="!rowEditable">确 定</el-button>
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
  name: 'MyAppointment',
  data() {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
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
      appointmentStarted: false,
      appointmentEnded: false,
      appointmentApproved: false,
      startTimeOptions: { selectableRange: '10:30:00 - 22:30:00' },
      endTimeOptions: { selectableRange: '8:30:00 - 22:30:00' },
      startTime: '',
      endTime: '',
      tooltipDisabled: true,
      timePickerDisabled: false,
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
      ],
      classroomTableData: [],
      classroomLoading: true,
      classroomTotal: 0,
      classroomPageNum: 1,
      classroomPageSize: 5,
      classroomTableVisible: false,
      getcadMinName: []
    }
  },
  created() {
    this.load()
  },
  methods: {
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
      await this.loadClassroom()
      await request.get('/appointment/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_id: this.user.uid,
          c_name: this.c_name,
          a_date: this.a_date,
          a_start_time: this.a_start_time,
          a_end_time: this.a_end_time
        }
      }).then((res) => {
        if (res.code === '200') {
          const data = res.data
          this.total = res.data.total
          for (let i = 0; i < data.length; i++) {
            data[i].adate = dateUtils.formatDate(new Date(data[i].astartTime), 'yyyy-MM-dd')
            data[i].astartTime = dateUtils.formatDate(new Date(data[i].astartTime), 'hh:mm')
            data[i].aendTime = dateUtils.formatDate(new Date(data[i].aendTime), 'hh:mm')
          }
          this.tableData = data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.loading = false
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
      await request.get('/user/name/' + row.cadminId).then((res) => {
        row.cadminName = res.data.uname
      })
      this.form = { ...row }

      if (this.form.astatus === 1) {
        this.rowEditable = true
        this.appointmentStarted = false
        this.appointmentEnded = false
      }
      if (this.form.astatus === 2) {
        this.rowEditable = false
        this.appointmentStarted = true
        this.appointmentEnded = false
      }
      if (this.form.astatus === 3) {
        this.rowEditable = false
        this.appointmentStarted = false
        this.appointmentEnded = true
      }
      this.appointmentApproved = this.form.aapprovalStatus === 2 && this.form.astatus === 1

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
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
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
      request.get('/appointment/edit', {
        params: {
          aid: this.form.aid,
          uid: this.user.uid,
          cid: this.form.cid,
          date: this.selectedDate,
          startTime: this.startTime,
          endTime: this.endTime
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
        } else if (res.code === '403') {
          this.dialogFormVisible = false
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
    getLabel(list, id, value, label) {
      if (id !== '' && Array.isArray(list) && list.length !== 0) {
        const found = list.find((item) => item[value] == id)
        return found ? found[label] : id
      }
      return id
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
    },
    async classroomChange(row) {
      this.form.cid = row.cid
      await request.get('/classroom/' + this.form.cid).then((res) => {
        this.form.cname = res.cname
        this.form.cvolume = res.cvolume
        this.form.caddress = res.caddress
        this.form.cadminId = res.cadminId
      })
      this.classroomTableVisible = false
      this.$message.success('教室已更新，点击保存以提交修改')
    },
    async loadClassroom() {
      this.classroomLoading = true
      this.loadAdminNameList()
      await request.get('/classroom/page', {
        params: {
          pageNum: this.classroomPageNum,
          pageSize: this.classroomPageSize
        }
      }).then((res) => {
        if (res.code === '200') {
          this.classroomTableData = res.data.records
          this.classroomTotal = res.data.total
        }
        this.classroomLoading = false
      })
    },
    handleClassroomSizeChange(pageSize) {
      this.classroomPageSize = pageSize
      this.loadClassroom()
    },
    handleClassroomCurrentChange(pageNum) {
      this.classroomPageNum = pageNum
      this.loadClassroom()
    },
    loadAdminNameList() {
      request.get('/user/classroom-admin').then((res) => {
        this.getcadMinName = res.data
      })
    }
  }
}
</script>

<style scoped></style>
