<template>
  <div>
    <!--面包屑组件-->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/classroom-admin/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约管理</el-breadcrumb-item>
      <el-breadcrumb-item>现存预约</el-breadcrumb-item>
    </el-breadcrumb>

    <!--搜索框组件-->
    <div>
      <el-input
          suffix-icon="el-icon-school"
          placeholder="教室名称"
          v-model="c_name"
          style="width: 125px; margin-right: 5px; margin-top: 5px">

      </el-input>
      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="用户姓名"
          v-model="u_name"
          style="width: 150px; margin-right: 5px; margin-top: 5px">

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

    <!--新增与批量删除-->
    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel" :disabled="batchDelDisabled">
        批量删除
      </el-button>
    </div>

    <!--      表格主体-->
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        :row-class-name="tableRowClassName"
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="39">
      </el-table-column>
      <el-table-column prop="uname" label="用户姓名" width="75" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="ustuNum" label="学生学号" width="100" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="cname" label="教室名称" width="75" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="adate" label="日期" width="100" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="astartTime" label="开始时间" width="75" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="aendTime" label="结束时间" width="75" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="astatus" label="时间状态" width="75px" header-align="center" align="center">
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
          width="172"
          header-align="center" align="center">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">查看详情</el-button>
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

    <!--        修改预约dialog窗口-->
    <el-dialog title="预约详情" :visible.sync="dialogFormVisible">
      <el-alert v-show="!rowEditable"
                title="预约时间已过，您不能在此修改信息。如有需要，可以删除本次预约重新预约。"
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
        <h4 style="margin-bottom: 10px">用户信息</h4>
        <el-descriptions :column=2>
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
            @change="handleDateChange"
            type="date"
            placeholder="选择日期"
            style="margin-top: 15px"
            value-format="yyyy-MM-dd"
            :picker-options="datePickerOptions"
            :disabled="datePickerDisabled">
        </el-date-picker>
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
        <el-button @click="handleDialogCancel" type="primary">确 定</el-button>
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
import * as dateUtils from "../../utils/date";
export default {
  name: "ClassroomAdminAppointment",
  data() {
    return {
      //当前用户
      user: {},

      //搜索框数据
      c_name: "",
      u_name: "",
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

      // 批量删除相关
      multipleSelection: [],
      batchDelDisabled: true,

      //预约状态显示相关
      getType: [
        {dictValue: 1, dictLabel: '已预约'},
        {dictValue: 2, dictLabel: '已开始'},
        {dictValue: 3, dictLabel: '已结束'},
      ],
      getApprovalType: [
        {dictValue: 1, dictLabel: '待审核'},
        {dictValue: 2, dictLabel: '已通过'},
        {dictValue: 3, dictLabel: '已拒绝'},
      ]
    }
  },

  created() {
    this.load()
  },

  methods: {
    /**
     * 从浏览器存储中加载当前用户数据
     */
    loadCurrentUser() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")): {}
    },

    /**
     * 打开新增弹窗并将form置空
     */
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
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

      await request.get("/user/" + row.uid).then(res => {
        console.log('res', res)
        this.$set(row, 'uphone', res.uphone)
        this.$set(row, 'uemail', res.uemail)
      })

      this.form = row
      this.rowEditable = true
      if (this.form.astatus === 2 || this.form.astatus === 3)
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
     * 确认批量删除：向后端发送批量删除请求
     */
    delBatch() {
      let a_ids = this.multipleSelection.map(v => v.aid)
      request.post("/appointment/del/batch/", a_ids).then(res => {
        console.log(res)
        if (res) {
          this.$message.success({
            showClose: true,
            message: "批量删除成功！"
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
     * 批量删除确认：打开批量删除确认框
     */
    confirmBatchDel() {
      this.$confirm('此操作不可撤销, 是否继续?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBatch();
      }).catch(() => {
      });
    },

    /**
     * 选择器：当所选行变化后，更新目前所选内容
     * @param val
     */
    handleSelectionChange(val) {
      if (val.length === 0) {
        this.batchDelDisabled = true
      } else {
        this.batchDelDisabled = false
      }
      this.multipleSelection = val
    },

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
      this.loadCurrentUser()

      await request.get("/appointment/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_name: this.u_name,
          c_name: this.c_name,
          c_admin_id: this.user.uid
        }
      }).then(async res => {
            if (res.code === "200") {
              let data = res.data.records
              this.total = res.data.total

              for (let i = 0; i < this.total; i++) {

                // 查询到用户姓名、学号并存储至tableData
                await request.get("/user/" + data[i].uid).then(res => {
                  data[i].uname = res.uname
                  data[i].ustuNum = res.ustuNum
                })

                // 查询到教室名称并存储至tableData
                await request.get("/classroom/" + data[i].cid).then(res => {
                  data[i].cname = res.cname
                })

                // 格式化后台传来的Date，使日期、开始时间和结束时间能在表格中正确显示
                data[i].adate = dateUtils.formatDate(new Date(data[i].astartTime), 'yyyy-MM-dd')
                data[i].astartTime = dateUtils.formatDate(new Date(data[i].astartTime), 'hh:mm')
                data[i].aendTime = dateUtils.formatDate(new Date(data[i].aendTime), 'hh:mm')
              }
              this.tableData = data
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
     * 新增或更新：向后端发送新增/已经修改过的教室数据
     */
    save() {
      request.post("http://localhost:8081/classroom", this.form).then(res => {
        if (res) {
          this.dialogFormVisible = false
          this.$message.success({
            showClose: true,
            message: "保存成功！"
          })
          this.load()
        } else {
          this.$message.error({
            showClose: true,
            message: "保存失败！请稍后再试"
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
          uid: this.form.uid,
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
      else if (astatus === 3)
        tagType = "danger"
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
      } else if (row.aapprovalStatus === 3 || row.astatus === 3) {
        rowClass = 'error-row'
      } else if (row.aapprovalStatus === 2 && row.astatus === 1) {
        rowClass = 'success-row'
      }
      return rowClass;
    },
  }
}
</script>

<style scoped>

</style>