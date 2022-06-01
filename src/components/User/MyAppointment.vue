<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教室预约</el-breadcrumb-item>
      <el-breadcrumb-item>我的预约</el-breadcrumb-item>
    </el-breadcrumb>

    <!--搜索框组件-->
    <div>
      <el-input
          suffix-icon="el-icon-school"
          placeholder="教室名称"
          v-model="c_name"
          style="width: 125px; margin-right: 5px; margin-top: 5px">

      </el-input>

      <el-date-picker
          style="margin-right: 5px; margin-top: 5px; width: 130px"
          v-model="a_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
      <el-time-picker
          v-model="a_start_time"
          :picker-options="startTimeOptions"
          @change="handleFilterStartTimeChange"
          style="margin-right: 5px; margin-top: 5px; width: 130px"
          value-format="HH:mm:ss"
          format="HH:mm"
          placeholder="开始时间">
      </el-time-picker>
      <el-time-picker
          arrow-control
          v-model="a_end_time"
          :picker-options="endTimeOptions"
          style="margin-right: 5px; margin-top: 5px; width: 130px"
          value-format="HH:mm:ss"
          format="HH:mm"
          placeholder="结束时间">
      </el-time-picker>

      <el-button
          type="primary"
          style="margin-top: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-top: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>
    </div>

    <!--      表格主体-->
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        :row-class-name="tableRowClassName"
        style="margin-top: 10px; width: 100%">
      <el-table-column prop="cname" label="教室名称" width="75">
      </el-table-column>
      <el-table-column prop="adate" label="日期" width="100">
      </el-table-column>
      <el-table-column prop="astartTime" label="开始时间" width="75">
      </el-table-column>
      <el-table-column prop="aendTime" label="结束时间" width="75">
      </el-table-column>
      <el-table-column prop="astatus" label="状态" width="75px">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.astatus)">
            {{ getLabel(getType, scope.row.astatus, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="astatus" label="审核状态" width="75px" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag :type="getApprovalTagType(scope.row.aapprovalStatus)">
            {{ getLabel(getApprovalType, scope.row.aapprovalStatus, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="172">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='删除'
              confirm-button-type="danger"
              cancel-button-text='取消'
              confirm-button-size="mini"
              icon="el-icon-info"
              icon-color="red"
              title="该操作无法撤销，确认删除？"
              @confirm="handleDelete(scope.row)"
          >
            <el-button type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
          </el-popconfirm>
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
<!--    todo 在管理员界面完成教师修改功能后要在此处完成同步修改-->
    <el-dialog title="修改预约" :visible.sync="dialogFormVisible">
      <el-alert v-show="appointmentStarted"
                title="预约已经开始，您不能在此修改信息。如有需要，可以取消本次预约重新预约。"
                type="warning"
                show-icon>
      </el-alert>
      <el-alert v-show="appointmentEnded"
                title="预约已经结束，您不能在此修改信息。如有需要，请重新预约。"
                type="info"
                show-icon>
      </el-alert>
      <el-alert v-show="appointmentApproved"
                title="预约已获批准，如果修改信息则需要重新等待教室管理员审核。"
                type="warning"
                show-icon>
      </el-alert>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column=2>
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="教室管理员">{{ form.cadminName }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ form.cadminPhone }}</el-descriptions-item>
        </el-descriptions>
        <el-popover
            placement="bottom"
            width="600"
            v-model="classroomTableVisible"
            trigger="click">
          <!--      表格主体-->
          <el-table
              height="200"
              v-loading="classroomLoading"
              :data="classroomTableData"
              border
              stripe
              style="margin-top: 10px">
            <el-table-column prop="cname" label="教室名称" width="100" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="cvolume" label="容纳人数" width="75" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="caddress" label="地址" width="200" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="cadminName" label="教室管理员" width="90" header-align="center" align="center">
              <template slot-scope="scope">
                {{ getLabel(getcadMinName, scope.row.cadminId, "uid", "uname") }}
              </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="77"
                header-align="center" align="center">
              <template v-slot:default="scope">
                <el-button type="primary" @click="classroomChange(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--        分页组件-->
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
          <el-button slot="reference" style="margin-top: 10px" :disabled="!rowEditable">修改教室</el-button>
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
            value-format="yyyy-MM-dd"
            :picker-options="datePickerOptions"
            :disabled="datePickerDisabled">
        </el-date-picker>
        <el-button style="margin-left: 10px" icon="el-icon-date" @click="editDate" :disabled="!rowEditable">修改日期
        </el-button>
      </el-card>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4>预约时间</h4>
        <el-form :inline="true" style="margin-top: 10px">
          <el-form-item label="开始时间">
            <el-input
                prefix-icon="el-icon-time"
                v-model="form.astartTime"
                style="width: 125px"
                :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item label="结束时间" style="margin-left: 20px">
            <el-input
                prefix-icon="el-icon-time"
                v-model="form.aendTime"
                style="width: 125px"
                :disabled="true">
            </el-input>
          </el-form-item>
          <el-button icon="el-icon-time" @click="editTime" :disabled="!rowEditable">修改时间</el-button>

        </el-form>
        <div v-show="timePickerVisible">
          <h4>修改时间</h4>
          <el-tooltip
              style="margin-top: 10px"
              content="您的日期选择为今天，当日期选择为当天时，您最早可以选择半小时后的时间进行预约"
              placement="bottom"
              effect="light"
              :visible="false"
              :disabled="tooltipDisabled">
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
        </div>

      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="submit" :disabled="!rowEditable">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.el-table .warning-row {
  background: #fff8ee;
}

.el-table .error-row {
  background: #fce9e9;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import request from "@/utils/request";
import * as dateUtils from "@/utils/date";

export default {
  name: "MyAppointment",
  data() {
    return {
      //当前用户
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      //搜索框数据
      c_name: "",
      a_date: "",
      a_start_time: "",
      a_end_time: "",


      // 表格数据相关
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,

      // 新增编辑相关
      form: {},
      dialogFormVisible: false,
      datePickerDisabled: true,
      timePickerVisible: false,
      selectedDate: "",
      rowEditable: true,

      //判断预约是否可编辑
      appointmentStarted: false,
      appointmentEnded: false,
      appointmentApproved: false,

      //时间选择器相关
      startTimeOptions: {
        selectableRange: '10:30:00 - 22:30:00'
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
      timePickerDisabled: false,

      //预约状态显示相关
      getType: [
        {dictValue: 1, dictLabel: '已预约'},
        {dictValue: 2, dictLabel: '已开始'},
        {dictValue: 3, dictLabel: '已结束'},
        {dictValue: 4, dictLabel: '已失效'}
      ],
      getApprovalType: [
        {dictValue: 1, dictLabel: '待审核'},
        {dictValue: 2, dictLabel: '已通过'},
        {dictValue: 3, dictLabel: '已拒绝'},
      ],

      // 教室表格数据相关
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
    /**
     * 重置搜索框：将所有搜索属性置空
     */
    reset() {
      this.c_name = ""
      this.u_name = ""
      this.a_start_time = ""
      this.a_end_time = ""
      this.a_date = ""
      this.load()
    },

    /**
     * 重新加载表格数据
     */
    async load() {
      this.loading = true
      await this.loadClassroom()
      let data

      await request.get("/appointment/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_id: this.user.uid,
          c_name: this.c_name,
          a_date: this.a_date,
          a_start_time: this.a_start_time,
          a_end_time: this.a_end_time
        }
      }).then(async res => {
            if (res.code === "200") {
              data = res.data
              this.total = res.data.length

              // console.log("TableData in res block: " + this.tableData)

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

                this.tableData = data
              }
            } else {
              this.$message.error({
                showClose: true,
                message: res.msg
              })
            }
          }
      )

      this.loading = false
    },

    /**
     * 关闭新增/编辑窗口
     */
    handleDialogCancel() {
      this.dialogFormVisible = false
      this.timePickerVisible = false
      this.datePickerDisabled = true
      this.startTime = ""
      this.endTime = ""
      this.selectedDate = ""
      this.startTimeOptions.selectableRange = '8:30:00 - 22:30:00'
    },

    /**
     * 编辑：将所选行的值赋给form并打开编辑菜单
     * @param row
     */
    async handleEdit(row) {
      await request.get("/classroom/" + row.cid).then(res => {
        row.cvolume = res.cvolume
        row.caddress = res.caddress
        row.cadminId = res.cadminId
      })

      await request.get("/user/phone/" + row.cadminId).then(res => {
        row.cadminPhone = res
      })

      await request.get("/user/name/" + row.cadminId).then(res => {
        row.cadminName = res.data.uname
      })
      this.form = row

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

      if (this.form.aapprovalStatus === 2 && this.form.astatus === 1) {
        this.appointmentApproved = true
      } else {
        this.appointmentApproved = false
      }

      this.selectedDate = this.form.adate
      this.handleDateChange()
      this.dialogFormVisible = true
    },

    /**
     * 删除：删除所选单条预约
     * @param row
     */
    handleDelete(row) {
      request.delete("/appointment/" + row.aid).then(res => {
        if (res) {
          this.$message.success({
            showClose: true,
            message: "删除成功！"
          })
          this.load()
        } else {
          this.$message.error({
            showClose: true,
            message: "操作失败！请稍后再试"
          })
        }
      })
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
     * 当用户选择日期变化后，如果所选日期为当天，时间选择范围会被限制为当前时间之后的半个小时至22:00
     */
    handleDateChange() {
      let today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today = this.dateFormat(today)

      if (this.selectedDate === today) {
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
      console.log(this.endTimeOptions.selectableRange)
    },

    /**
     * 向后台提交修改预约请求
     */
    submit() {
      request.get("/appointment/edit", {
        params: {
          aid: this.form.aid,
          uid: this.user.uid,
          cid: this.form.cid,
          date: this.selectedDate,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then(res => {
        if (res.code === '200') {
          this.dialogFormVisible = false
          this.load()
          this.$message.success("修改成功")
          this.timePickerVisible = false
          this.datePickerDisabled = true
          this.startTime = ""
          this.endTime = ""
        } else if (res.code === '403') {
          this.dialogFormVisible = false
          this.timePickerVisible = false
          this.datePickerDisabled = true
          this.startTime = ""
          this.endTime = ""
        } else {
            this.$message.error(res.msg)
        }
      })
    },

    /**
     * 修改日期
     */
    editDate() {
      this.datePickerDisabled = false
    },

    editTime() {
      this.handleDateChange()
      this.timePickerVisible = true
    },

    /**
     * 将date类型转化为yyyy-MM-dd字符串
     * @param time
     * @returns {string}
     */
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      // var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
      // var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
      // var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
      // 拼接
      return year + "-" + month + "-" + day;
    },

    /**
     * 根据传入的值,返回对应的中文name，常用的地方是表格那里
     * list: 传入的源数组
     * id: 传入的值
     * value: 源数组中为了匹配id值的字段名称
     * label: 源数组中需要返回显示中文的字段名称
     * 示例：arr:[{dictValue: 0,dictLabel:'前端工程师'},{dictValue: 1,dictLabel:'Java工程师'}]
     * 调用getLabel(arr, 1, "dictValue", "dictLabel")返回了 Java工程师
     * */
    getLabel(list, id, value, label) {
      if (id != '' && Array.isArray(list) && list.length != 0) {
        return !list.find(item => item[value] == id) ? id : list.find(item => item[value] == id)[label]
      } else {
        return id
      }
    },

    /**
     * 根据预约类型获取标签颜色
     * @param astatus
     * @returns {string}
     */
    getTagType(astatus) {
      let tagType = ""
      if (astatus === 1)
        tagType = "success"
      else if (astatus === 2)
        tagType = "warning"
      else if (astatus === 3 || astatus === 4)
        tagType = "info"
      return tagType
    },
    getApprovalTagType(astatus) {
      let tagType = ""
      if (astatus === 1)
        tagType = "warning"
      else if (astatus === 2)
        tagType = "success"
      else if (astatus === 3)
        tagType = "danger"
      return tagType
    },

    /**
     * 表格颜色显示
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

    /**
     * 搜索框的开始时间变化后。结束时间的选择范围也要同步变化
     */
    handleFilterStartTimeChange() {
      console.log("a_start_time = ", this.a_start_time)
      this.endTimeOptions.selectableRange = this.a_start_time + " - 22:30:00"
    },

    /**
     * 选择新教室
     * @param row
     */
    async classroomChange(row) {
      this.form.cid = row.cid
      await request.get("/classroom/" + this.form.cid).then(res => {
        this.form.cname = res.cname
        this.form.cvolume = res.cvolume
        this.form.caddress = res.caddress
        this.form.cadminId = res.cadminId
      })
      this.classroomTableVisible = false
      this.$message.success({
        showClose: true,
        message: "教室已更新，点击保存以提交修改"
      })
    },

    /**
     * 加载教室表格数据
     */
    async loadClassroom() {
      this.classroomLoading = true
      this.loadAdminNameList()
      await request.get("http://localhost:8081/classroom/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          c_name: this.c_name,
          c_building: this.c_building,
          c_floor: this.c_floor,
          c_volume: this.c_volume,
          c_address: this.c_address
        }
      }).then(async res => {
        this.classroomTableData = res.records
        this.classroomTotal = res.total
        this.classroomLoading = false
      })
    },

    /**
     * 教室分页相关
     * @param pageSize
     */
    handleClassroomSizeChange(pageSize) {
      this.classroomPageSize = pageSize
      this.load()
    },
    handleClassroomCurrentChange(pageNum) {
      this.classroomPageNum = pageNum
      this.load()
    },

    /**
     * 加载全部教室管理员姓名
     */
    loadAdminNameList() {
      request.get("/user/classroom-admin").then(res => {
        this.getcadMinName = res.data
      })
    },

  }
}
</script>

<style scoped>

</style>