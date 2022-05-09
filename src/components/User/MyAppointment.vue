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
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          v-model="a_date"
          type="date"
          placeholder="选择日期">
      </el-date-picker>

      <el-time-select
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          placeholder="起始时间"
          v-model="a_start_time"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30'
    }">
      </el-time-select>
      <el-time-select
          style="margin-right: 5px; margin-top: 5px; width: 110px"
          placeholder="结束时间"
          v-model="a_end_time"
          :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '18:30',
      minTime: a_start_time
    }">
      </el-time-select>

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
        stripe
        style="margin-top: 10px">
      <el-table-column prop="cname" label="教室名称" width="75">
      </el-table-column>
      <el-table-column prop="adate" label="日期" width="100">
      </el-table-column>
      <el-table-column prop="astartTime" label="开始时间" width="75">
      </el-table-column>
      <el-table-column prop="aendTime" label="结束时间" width="75">
      </el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
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
    <el-dialog title="修改预约" :visible.sync="dialogFormVisible">
      <el-alert v-show="!rowEditable"
                title="预约已经开始，您不能在此修改信息。如有需要，可以取消本次预约重新预约。"
                type="warning"
                show-icon>
      </el-alert>
      <el-card shadow="hover" style="margin-top: 10px">
        <h4 style="margin-bottom: 10px">教室信息</h4>
        <el-descriptions :column=2>
          <el-descriptions-item label="教室名称">{{ form.cname }}</el-descriptions-item>
          <el-descriptions-item label="容纳人数">{{ form.cvolume }}</el-descriptions-item>
          <el-descriptions-item label="管理员联系电话">{{ form.cadminPhone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ form.caddress }}</el-descriptions-item>
        </el-descriptions>
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
          <el-tooltip content="Bottom center" placement="bottom" effect="light">
            <el-button icon="el-icon-time" @click="editTime" :disabled="!rowEditable">修改时间</el-button>
          </el-tooltip>
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
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

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

      await request.get("/appointment/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_id: this.user.uid,
          c_name: this.c_name,
        }
      }).then(async res => {
            if (res.code === "200") {
              this.tableData = res.data.records
              this.total = res.data.total

              // console.log("TableData in res block: " + this.tableData)

              for (let i = 0; i < this.total; i++) {

                // 查询到用户姓名、学号并存储至tableData
                await request.get("/user/" + this.tableData[i].uid).then(res => {
                  this.tableData[i].uname = res.uname
                  this.tableData[i].ustuNum = res.ustuNum
                })

                // 查询到教室名称并存储至tableData
                await request.get("/classroom/" + this.tableData[i].cid).then(res => {
                  this.tableData[i].cname = res.cname
                })

                // 格式化后台传来的Date，使日期、开始时间和结束时间能在表格中正确显示
                this.tableData[i].adate = dateUtils.formatDate(new Date(this.tableData[i].astartTime), 'yyyy-MM-dd')
                this.tableData[i].astartTime = dateUtils.formatDate(new Date(this.tableData[i].astartTime), 'hh:mm')
                this.tableData[i].aendTime = dateUtils.formatDate(new Date(this.tableData[i].aendTime), 'hh:mm')

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
     * 关闭新增/编辑串口
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
      this.form = row
      this.rowEditable = true
      if (this.form.astatus === 2)
        this.rowEditable = false
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
    }
  }
}
</script>

<style scoped>

</style>