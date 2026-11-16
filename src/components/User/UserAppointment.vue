<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的预约</el-breadcrumb-item>
      <el-breadcrumb-item>教室预约</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="教室名称" v-model="c_name" style="width: 125px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入容纳人数" v-model="c_volume" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入教学楼号" v-model="c_building" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入楼层" v-model="c_floor" style="width: 150px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-input placeholder="请输入地址" v-model="c_address" style="width: 200px; margin-right: 5px; margin-top: 5px"></el-input>
      <el-button type="primary" style="margin-top: 5px; margin-right: 5px" @click="load">搜索</el-button>
      <el-button style="margin-left: 0px; margin-top: 5px" @click="reset">重置</el-button>
    </div>

    <el-table height="500" v-loading="loading" :data="tableData" border stripe style="margin-top: 10px">
      <el-table-column prop="cname" label="教室名称" width="140"></el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120"></el-table-column>
      <el-table-column prop="caddress" label="地址"></el-table-column>
      <el-table-column label="操作" fixed="right" width="94">
        <template #default="scope">
          <el-button type="primary" @click="handleAppoint(scope.row)">预约</el-button>
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

    <el-dialog title="确认预约信息" v-model:visible="dialogFormVisible">
      <el-card shadow="hover">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column="dialogDescriptionColumn">
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="管理员联系电话">{{ form.cadminPhone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>选择日期</h4>
        <el-date-picker
            v-model="date"
            @change="handleDateChange"
            type="date"
            placeholder="选择日期"
            style="margin-top: 10px"
            value-format="YYYY-MM-DD">
        </el-date-picker>
        <el-button style="margin-left: 5px;" @click="checkApp">检查</el-button>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px;" v-if="appTableVisible">
        <el-table height="200" v-loading="appTableLoading" :data="appTableData" border :row-class-name="tableRowClassName" style="margin-top: 10px; width: 100%">
          <el-table-column prop="uname" label="用户姓名" width="75" header-align="center" align="center"></el-table-column>
          <el-table-column prop="ustuNum" label="学生学号" width="100" header-align="center" align="center"></el-table-column>
          <el-table-column prop="adate" label="日期" width="150"></el-table-column>
          <el-table-column prop="astartTime" label="开始时间" width="150"></el-table-column>
          <el-table-column prop="aendTime" label="结束时间" width="150"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleAppSizeChange"
            @current-change="handleAppCurrentChange"
            :current-page="appPageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="appPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="appTotal">
        </el-pagination>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">选择时间</h4>
        <el-tooltip content="您的日期选择为今天，当日期选择为当天时，您最早可以选择半小时后的时间进行预约" placement="bottom" effect="light" :disabled="tooltipDisabled">
          <el-time-picker style="margin-right: 5px" placeholder="起始时间" v-model="startTime" @change="handleStartTimeChange" format="HH:mm" :disabled="timePickerDisabled"></el-time-picker>
        </el-tooltip>
        <el-time-picker placeholder="结束时间" v-model="endTime" format="HH:mm" :disabled="timePickerDisabled"></el-time-picker>
      </el-card>
      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import * as dateUtils from '@/utils/date'

export default {
  name: 'UserAppointment',
  data() {
    return {
      c_name: '',
      c_volume: '',
      c_building: '',
      c_floor: '',
      c_address: '',
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      appTableLoading: true,
      appTableVisible: false,
      appTableData: [],
      dialogFormVisible: false,
      dialogDescriptionColumn: 2,
      appPageSize: 5,
      appPageNum: 1,
      appTotal: 0,
      startTimeOptions: { selectableRange: '8:30:00 - 22:30:00' },
      endTimeOptions: { selectableRange: '8:30:00 - 22:30:00' },
      date: '',
      startTime: '',
      endTime: '',
      tooltipDisabled: true,
      timePickerDisabled: true
    }
  },
  created() {
    this.load()
  },
  methods: {
    async handleAppoint(row) {
      await request.get('/user/phone/' + row.cadminId).then((res) => {
        if (res.code === '200') {
          row.cadminPhone = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      this.form = row
      this.dialogFormVisible = true
    },
    handleDialogCancel() {
      this.dialogFormVisible = false
    },
    submit() {
      request.get('/appointment/new', {
        params: {
          uid: this.user.uid,
          cid: this.form.cid,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then((res) => {
        if (res.code === '200') {
          this.dialogFormVisible = false
          this.$message.success('预约成功')
          this.$router.push('/user/my-appointment')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reset() {
      this.c_name = ''
      this.c_volume = ''
      this.c_building = ''
      this.c_floor = ''
      this.c_address = ''
      this.load()
    },
    async load() {
      this.loading = true
      await request.get('/classroom/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address
        }
      }).then((res) => {
        if (res.code === '200') {
          this.tableData = res.data.records
          this.total = res.data.total
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
    handleAppSizeChange(pageSize) {
      this.appPageSize = pageSize
      this.checkApp()
    },
    handleAppCurrentChange(pageNum) {
      this.appPageNum = pageNum
      this.checkApp()
    },
    handleDateChange() {
      this.timePickerDisabled = false
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      const todayStr = this.dateFormat(today)
      if (this.date === todayStr) {
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
    async checkApp() {
      this.appTableLoading = true
      this.appTableVisible = true
      await request.get('/appointment/page', {
        params: {
          pageNum: this.appPageNum,
          pageSize: this.appPageSize,
          c_name: this.form.cname,
          a_date: this.date
        }
      }).then((res) => {
        if (res.code === '200') {
          const data = res.data
          this.appTotal = res.data.total
          for (let i = 0; i < data.length; i++) {
            data[i].adate = dateUtils.formatDate(new Date(data[i].astartTime), 'yyyy-MM-dd')
            data[i].astartTime = dateUtils.formatDate(new Date(data[i].astartTime), 'hh:mm')
            data[i].aendTime = dateUtils.formatDate(new Date(data[i].aendTime), 'hh:mm')
          }
          this.appTableData = data
          this.appTableLoading = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    tableRowClassName({ row }) {
      if (row.aapprovalStatus === 1 || row.astatus === 2) return 'warning-row'
      if (row.aapprovalStatus === 3) return 'error-row'
      if (row.aapprovalStatus === 2 && row.astatus === 1) return 'success-row'
      if (row.astatus === 3) return 'info-row'
      return ''
    },
    dateFormat(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    }
  }
}
</script>

<style scoped></style>
