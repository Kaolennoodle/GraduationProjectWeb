<template>
  <div>

    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--        搜索栏-->
    <!--      u_name u_stuNum u_nickname u_phone u_email u_type u_loginName-->
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
          v-model="u_loginName"
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

    <!--        表格主体-->
    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd" icon="el-icon-circle-plus">新增</el-button>
      <el-button type="danger" icon="el-icon-delete-solid" @click="confirmBatchDel">批量删除</el-button>
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button type="primary" icon="el-icon-upload2">导出</el-button>
    </div>
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
      <el-table-column prop="uname" label="姓名" width="70">
      </el-table-column>
      <el-table-column prop="ustuNum" label="学号" width="120">
      </el-table-column>
      <el-table-column prop="unickname" label="昵称" width="100">
      </el-table-column>
      <el-table-column prop="uphone" label="电话" width="110">
      </el-table-column>
      <el-table-column prop="uemail" label="邮箱" width="170">
      </el-table-column>
      <el-table-column prop="utype" label="用户类型" width="70">
      </el-table-column>
      <el-table-column prop="uloginName" label="登录账号" width="160">
      </el-table-column>
      <!--      uname ustunum unickname uphone uemail utype uloginname-->
      <el-table-column
          label="操作"
          fixed="right"
          width="290px">
        <template v-slot:default="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text='重置'
              confirm-button-type="warning"
              cancel-button-text='取消'
              confirm-button-size="mini"
              icon="el-icon-info"
              icon-color="yellow"
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
    <!--      u_name u_stuNum u_nickname u_phone u_email u_type u_loginName-->
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
        <el-form-item label="用户类型">
          <el-select v-model="form.utype" placeholder="用户类型">
            <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="登录账号">
          <el-input v-model="form.uloginName" autocomplete="off" suffix-icon="el-icon-mouse"></el-input>
        </el-form-item>
      </el-form>

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
      u_loginName: "",
      dialogFormVisible: false,
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '学生'
      }, {
        value: '2',
        label: '教师'
      }, {
        value: '3',
        label: '教室管理员'
      }, {
        value: '4',
        label: '系统管理员'
      }
      ],
      options2: [{
        value: '1',
        label: '学生'
      }, {
        value: '2',
        label: '教师'
      }, {
        value: '3',
        label: '教室管理员'
      }, {
        value: '4',
        label: '系统管理员'
      }
      ],
      value: ''
    }
  },
  created() {
    this.load()
  },
  methods: {
    //打开新增弹窗并将form置空
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },

    handleDialogCancel() {
      this.dialogFormVisible = false
    },

    handleEdit(row) {
      this.form = row
      console.log(row)
      this.dialogFormVisible = true
    },

    handleDelete(row) {
      request.delete("/user/" + row.uid).then(res => {
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

    resetPassword(row) {
      console.log(row)
      console.log(row.uid)
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

    //批量删除
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

    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
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

    // 重新加载表格数据
    load() {
      this.loading = true
      request.get("http://localhost:8081/user/page", {
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
        console.log(res)
        this.tableData = res.records
        this.total = res.total
      })
      this.loading = false
    },


    // 新增或编辑的保存
    save() {
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


    //分页相关
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    }
  }
}
</script>

<style scoped>

</style>