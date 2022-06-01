<template>
  <div>
<!--    面包屑-->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的预约</el-breadcrumb-item>
      <el-breadcrumb-item>教室预约</el-breadcrumb-item>
    </el-breadcrumb>

    <!--        搜索栏-->
    <div>
      <el-input
          suffix-icon="el-icon-school"
          placeholder="教室名称"
          v-model="c_name"
          style="width: 125px; margin-right: 5px; margin-top: 5px">

      </el-input>

      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="请输入容纳人数"
          v-model="c_volume"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-office-building"
          placeholder="请输入教学楼号"
          v-model="c_building"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-d-caret"
          placeholder="请输入楼层"
          v-model="c_floor"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-position"
          placeholder="请输入地址"
          v-model="c_address"
          style="width: 200px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-button
          type="primary"
          style="margin-top: 5px; margin-right: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-left: 0px; margin-top: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>
    </div>

    <!--        表格主体-->
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px">
      <el-table-column prop="cname" label="教室名称" width="140">
      </el-table-column>
      <el-table-column prop="cvolume" label="容纳人数" width="120">
      </el-table-column>
      <el-table-column prop="caddress" label="地址">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="94">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-s-claim" @click="handleAppoint(scope.row)">预约</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--        分页组件-->
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

    <!--        预约dialog窗口-->
    <el-dialog title="确认预约信息" :visible.sync="dialogFormVisible">
      <el-card shadow="hover">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column=dialogDescriptionColumn>
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
            value-format="yyyy-MM-dd"
            :picker-options="datePickerOptions">
        </el-date-picker>
        <el-button style="margin-left: 5px;" @click="checkApp">检查</el-button>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px;" v-if="appTableVisible">
        <el-table
            height="200"
            v-loading="appTableLoading"
            :data="appTableData"
            border
            :row-class-name="tableRowClassName"
            style="margin-top: 10px; width: 100%">
          <el-table-column prop="uname" label="用户姓名" width="75" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="ustuNum" label="学生学号" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="adate" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="astartTime" label="开始时间" width="150">
          </el-table-column>
          <el-table-column prop="aendTime" label="结束时间" width="150">
          </el-table-column>
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
          <el-time-picker style="margin-right: 5px"
                          placeholder="起始时间"
                          v-model="startTime"
                          @change="handleStartTimeChange"
                          format="HH:mm"
                          :disabled="timePickerDisabled"
                          :picker-options=startTimeOptions>
          </el-time-picker>
        </el-tooltip>
        <el-time-picker
            placeholder="结束时间"
            v-model="endTime"
            format="HH:mm"
            :disabled="timePickerDisabled"
            :picker-options=endTimeOptions>
        </el-time-picker>

      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import request from "@/utils/request";
import * as dateUtils from "@/utils/date";

export default {
  name: "UserAppointment",
  data() {
    return {
      //搜索框数据
      c_name: "",
      c_volume: "",
      c_building: "",
      c_floor: "",
      c_address: "",

      // 从浏览器存储中获取当前用户信息
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},

      // 表格数据相关
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,

      //预约窗口显示信息
      form: {},

      //查询现有预约
      appTable: [],

      //预约表格
      appTableLoading: true,
      appTableVisible: false,
      appTableData: [],
      dialogFormVisible: false,
      infoDialogVisible: false,
      dialogDescriptionColumn: 2,
      appPageSize: 5,
      appPageNum: 1,
      appTotal: 0,

      //时间选择器相关
      startTimeOptions: {
        selectableRange: '8:30:00 - 22:30:00'
      },
      endTimeOptions: {
        selectableRange: '8:30:00 - 22:30:00'
      },
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }]
      },
      date: '',
      startTime: '',
      endTime: '',
      appointment: {},
      tooltipDisabled: true,
      timePickerDisabled: true
    }
  },
  created() {
    this.load()
  },
  methods: {

    /**
     * 获取到当前教室信息并打开预约窗口
     * @param row
     */
    async handleAppoint(row) {
      await request.get("/user/phone/" + row.cadminId).then(res => {
        if (res.code === "200") {
          row.cadminPhone = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })
      this.form = row;
      this.dialogFormVisible = true;
    },

    /**
     * 预约dialog窗口的取消按钮功能
     */
    handleDialogCancel() {
      this.dialogFormVisible = false;
    },

    /**
     * 向后台提交预约请求
     */
    submit() {
      this.appointment.cid = this.form.cid;
      this.appointment.uid = this.user.uid;
      this.appointment.startTime = this.startTime;
      this.appointment.endTime = this.endTime;
      this.appointment.date = this.date;
      console.log("date = " + this.date)
      request.get("/appointment/new", {
        params: {
          uid: this.appointment.uid,
          cid: this.appointment.cid,
          date: this.date,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then(res => {
        if (res.code === '200') {
          this.dialogFormVisible = false;
          this.$message.success("预约成功")
          this.$router.push("/user/my-appointment")
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    /**
     * 重置搜索框：将所有搜索属性置空
     */
    reset() {
      this.c_name = ""
      this.c_volume = ""
      this.c_building = ""
      this.c_floor = ""
      this.c_address = ""
      this.load()
    },

    /**
     * 重新加载表格数据
     */
    load() {
      this.loading = true

      request.get("/classroom/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address,
          a_date: this.a_date,
          a_start_time: this.a_start_time,
          a_end_time: this.a_end_time
        }
      }).then(res => {
        this.tableData = res.records
        this.total = res.total
      })
      this.loading = false
    },

    /**
     * 分页相关
     * @param pageSize
     */
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },

    /**
     * 预约列表分页相关
     * @param pageSize
     */
    handleAppSizeChange(pageSize) {
      this.appPageSize = pageSize
      this.load()
    },
    handleAppCurrentChange(pageNum) {
      this.appPageNum = pageNum
      this.load()
    },

    /**
     * 当用户选择日期变化后，解锁时间选择，如果所选日期为当天，时间选择范围会被限制为当前时间之后的半个小时至22:00
     */
    handleDateChange() {
      this.timePickerDisabled = false
      let tomorrow = new Date()
      tomorrow.setHours(0)
      tomorrow.setMinutes(0)
      tomorrow.setSeconds(0)
      if(this.date < tomorrow) {
        this.tooltipDisabled = false
        let currentDate = new Date()
        currentDate.setTime(currentDate.getTime() + 1800 * 1000)
        this.startTimeOptions.selectableRange = dateUtils.formatDate(currentDate, "hh:mm:ss") + " - 22:30:00"
      } else {
        this.tooltipDisabled = true
        this.startTimeOptions.selectableRange = "8:30:00 - 22:30:00"
      }
    },

    /**
     * 当开始时间确定后，会调整结束时间的选择范围，使其不早于开始时间
     */
    handleStartTimeChange() {
      this.endTimeOptions.selectableRange = dateUtils.formatDate(this.startTime, "hh:mm:ss") + " - 22:30:00"
    },

    /**
     * 搜索框的开始时间变化后。结束时间的选择范围也要同步变化
     */
    handleFilterStartTimeChange() {
      console.log("a_start_time = ", this.a_start_time)
      this.endTimeOptions.selectableRange = this.a_start_time + " - 22:30:00"
    },

    /**
     * 检查现存预约展示于表格
     */
    async checkApp() {
      console.log(this.date)
      console.log(this.form.c_name)
      this.appTableLoading = true
      this.appTableVisible = true
      let data
      await request.get("/appointment/page", {
        params: {
          pageNum: this.appPageNum,
          pageSize: this.appPageSize,
          c_name: this.form.c_name,
          a_date: this.date,
        }
      }).then(async res => {
        if (res.code === '200') {
          data = res.data
          this.appTotal = res.data.length
          this.appTableData = data
          this.appTableLoading = false
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })
      for (let i = 0; i < this.total; i++) {

        // // 查询到用户姓名、学号并存储至tableData
        // await request.get("/user/" + data[i].uid).then(res => {
        //   data[i].uname = res.uname
        //   data[i].ustuNum = res.ustuNum
        // })
        //
        // // 查询到教室名称并存储至tableData
        // await request.get("/classroom/" + data[i].cid).then(res => {
        //   data[i].cname = res.cname
        // })

        // 格式化后台传来的Date，使日期、开始时间和结束时间能在表格中正确显示
        data[i].adate = dateUtils.formatDate(new Date(data[i].astartTime), 'yyyy-MM-dd')
        data[i].astartTime = dateUtils.formatDate(new Date(data[i].astartTime), 'hh:mm')
        data[i].aendTime = dateUtils.formatDate(new Date(data[i].aendTime), 'hh:mm')

      }

    },

    /**
     * 预约表格颜色显示
     * @param row
     * @param rowIndex
     * @returns {string}
     */
    tableRowClassName({row, rowIndex}) {
      let rowClass = ''
      if (row.aapprovalStatus === 1 || row.astatus === 2) {
        rowClass = 'warning-row'
      } else if (row.aapprovalStatus === 3) {
        rowClass = 'error-row'
      } else if (row.aapprovalStatus === 2 && row.astatus === 1) {
        rowClass = 'success-row'
      } else if (row.astatus === 3) {
        rowClass = 'info-row'
      }
      return rowClass;
    },

  }
}
</script>

<style scoped>

</style>