<template>
  <div>

    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--        搜索栏-->
    <div>
      <el-input
          suffix-icon="el-icon-search"
          placeholder="姓名"
          v-model="u_name"
          style="width: 75px">
      </el-input>
      <el-input
          suffix-icon="el-icon-user-solid"
          placeholder="学号"
          v-model="u_stu_num"
          style="width: 100px; margin-left: 5px">
      </el-input>
      <el-input
          suffix-icon="el-icon-position"
          placeholder="昵称"
          v-model="u_nickname"
          style="width: 75px; margin-left: 5px">
      </el-input>
      <el-input
          suffix-icon="el-icon-phone"
          placeholder="电话"
          v-model="u_phone"
          style="width: 100px; margin-left: 5px">
      </el-input>
      <el-input
          suffix-icon="el-icon-message"
          placeholder="邮箱"
          v-model="u_email"
          style="width: 150px; margin-left: 5px">
      </el-input>
      <el-select v-model="u_type" placeholder="用户类型" style="margin-left: 5px; width: 120px">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-input
          placeholder="登录账号"
          v-model="u_login_name"
          style="width: 80px; margin-left: 5px">
      </el-input>
      <el-button
          type="primary"
          style="margin-left: 5px"
          icon="el-icon-search"
          @click="load">搜索
      </el-button>
      <el-button
          style="margin-left: 5px"
          icon="el-icon-refresh"
          @click="reset">重置
      </el-button>
    </div>

    <!--        新增与批量删除-->
    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel">批量删除</el-button>
    </div>

    <!--    表格主体-->
    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="39">
      </el-table-column>
      <el-table-column prop="uname" label="姓名" width="70" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="ustuNum" label="学号" width="120" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="unickname" label="昵称" width="100" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="uphone" label="电话" width="110" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="uemail" label="邮箱" width="170" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="utype" label="用户类型" width="100" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag :type="getTagType(scope.row.utype)">
            {{ getLabel(getType, scope.row.utype, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="uloginName" label="登录账号" width="180" header-align="center" align="center">
      </el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          width="290px"
          header-align="center">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='重置'
              confirm-button-type="warning"
              cancel-button-text='取消'
              confirm-button-size="mini"
              icon="el-icon-info"
              icon-color="red"
              title="此操作将重置该用户的密码，是否继续？"
              @confirm="resetPassword(scope.row)"
          >
            <el-button type="warning" icon="el-icon-refresh" slot="reference">重置密码</el-button>
          </el-popconfirm>
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


    <!--        新增/编辑dialog窗口-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="form.uname" autocomplete="off" suffix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.ustuNum" autocomplete="off" suffix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.unickname" autocomplete="off" suffix-icon="el-icon-chat-dot-round"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.uphone" autocomplete="off" suffix-icon="el-icon-mobile-phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.uemail" autocomplete="off" suffix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input v-model="form.uloginName" autocomplete="off" suffix-icon="el-icon-mouse"></el-input>
        </el-form-item>
      </el-form>
      <el-popover
          style="margin-left: 40px;"
          placement="right"
          width="300"
          trigger="click">
        <el-radio v-model="form.utype" label="1">学生</el-radio>
        <el-radio v-model="form.utype" label="2">教师</el-radio>
        <el-radio v-model="form.utype" label="3">教室管理员</el-radio>
        <el-radio v-model="form.utype" label="4">系统管理员</el-radio>
        <el-button slot="reference">更改用户类型</el-button>
      </el-popover>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "User",
  data() {
    return {
      tableData: [],
      records: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      multipleSelection: [],
      u_id: "",
      u_name: "",
      u_stu_num: "",
      u_nickname: "",
      u_phone: "",
      u_email: "",
      u_type: "",
      u_login_name: "",
      dialogFormVisible: false,
      options: [
        {label: "学生", value: 1},
        {label: "教师", value: 2},
        {label: "教室管理员", value: 3},
        {label: "系统管理员", value: 4}
      ],
      getType: [
        {dictValue: 1, dictLabel: '学生'},
        {dictValue: 2, dictLabel: '教师'},
        {dictValue: 3, dictLabel: '教室管理员'},
        {dictValue: 4, dictLabel: '系统管理员'}
      ],
      value: ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    /**
     * 打开新增弹窗并将form置空
     */
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    /**
     * 关闭新增/编辑串口
     */
    handleDialogCancel() {
      this.dialogFormVisible = false
    },

    /**
     * 编辑：将所选行的值赋给form并打开编辑菜单
     * @param row
     */
    handleEdit(row) {
      this.form = row
      console.log(row)
      this.dialogFormVisible = true
    },

    /**
     * 删除：删除所选单个用户
     * @param row
     */
    handleDelete(row) {
      request.delete("/user/" + row.uid).then(res => {
        if (res.code === '200') {
          this.$message.success({
            showClose: true,
            message: "删除成功！"
          })
          this.load()
        }  else if (res.code === "600") {
          this.$confirm('当前用户已经存在预约，继续删除将会删除所有与该用户相关的预约，确认删除？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            request.delete("/user/force/" + row.uid).then(res => {
              if (res.code === '200') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.reset()
              } else {
                this.$message.error({
                  showClose: true,
                  message: res.msg
                })
              }
            })
          }).catch(() => {
          });
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })
    },

    /**
     * 重置密码：将所选用户的密码重置为默认密码
     * @param row
     */
    resetPassword(row) {
      request.post("/user/reset/pwd/" + row.uid).then(res => {
        if (res) {
          this.$message.success({
            showClose: true,
            message: "操作成功！"
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
      let u_ids = this.multipleSelection.map(v => v.uid)
      request.post("/user/del/batch/", u_ids).then(res => {
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
      this.multipleSelection = val
    },

    /**
     * 重新加载表格数据重置搜索框：将所有搜索属性置空
     */
    reset() {
      this.u_name = ""
      this.u_stu_num = ""
      this.u_nickname = ""
      this.u_phone = ""
      this.u_email = ""
      this.u_type = ""
      this.u_login_name = ""
      this.load()
    },

    /**
     * 重新加载表格数据
     */
    async load() {
      this.loading = true
      await request.get("http://localhost:8081/user/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          u_name: this.u_name,
          u_stu_num: this.u_stu_num,
          u_nickname: this.u_nickname,
          u_phone: this.u_phone,
          u_email: this.u_email,
          u_type: this.u_type,
          u_login_name: this.u_login_name
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
      this.loading = false
    },

    /**
     * 新增或更新：向后端发送新增/已经修改过的用户数据
     */
    save() {
      console.log('Output from User.Vue: ')
      console.log(this.form)
      request.post("/user", this.form).then(res => {
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
     * 表格中按用户类型筛选
     * @param value
     * @param row
     * @returns {boolean}
     */
    filterUType(value, row) {
      return row.tag === value;
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
     * 根据用户类型判断标签颜色
     */
    getTagType(utype) {
      let tagType = ""
      if (utype === 1) {
        tagType = ""
      } else if (utype === 2) {
        tagType = "success"
      } else if (utype === 3) {
        tagType = "warning"
      } else if (utype === 4) {
        tagType = "danger"
      }
      return tagType
    },

    /**
     * 更改用户类型
     */
    open() {
      this.$confirm('你想更改' + this.form.uname + '的用户类型为：', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>

</style>