<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input placeholder="姓名" v-model="u_name" style="width: 75px"></el-input>
      <el-input placeholder="学号" v-model="u_stu_num" style="width: 100px; margin-left: 5px"></el-input>
      <el-input placeholder="昵称" v-model="u_nickname" style="width: 75px; margin-left: 5px"></el-input>
      <el-input placeholder="电话" v-model="u_phone" style="width: 100px; margin-left: 5px"></el-input>
      <el-input placeholder="邮箱" v-model="u_email" style="width: 150px; margin-left: 5px"></el-input>
      <el-select v-model="u_type" placeholder="用户类型" style="margin-left: 5px; width: 120px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input placeholder="登录账号" v-model="u_login_name" style="width: 80px; margin-left: 5px"></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="load">搜索</el-button>
      <el-button style="margin-left: 5px" @click="reset">重置</el-button>
    </div>

    <div style="margin-top: 10px">
      <el-button type="success" @click="handleAdd">新增</el-button>
      <el-button type="danger" @click="confirmBatchDel">批量删除</el-button>
    </div>

    <el-table
        height="500"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="margin-top: 10px"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="39"></el-table-column>
      <el-table-column prop="uname" label="姓名" width="70" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ustuNum" label="学号" width="120" header-align="center" align="center"></el-table-column>
      <el-table-column prop="unickname" label="昵称" width="100" header-align="center" align="center"></el-table-column>
      <el-table-column prop="uphone" label="电话" width="110" header-align="center" align="center"></el-table-column>
      <el-table-column prop="uemail" label="邮箱" width="170" header-align="center" align="center"></el-table-column>
      <el-table-column prop="utype" label="用户类型" width="100" header-align="center" align="center">
        <template #default="scope">
          <el-tag :type="getTagType(scope.row.utype)">
            {{ getLabel(getType, scope.row.utype, 'dictValue', 'dictLabel') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="uloginName" label="登录账号" width="180" header-align="center" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="290px" header-align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
              confirm-button-text="重置"
              cancel-button-text="取消"
              title="此操作将重置该用户的密码，是否继续？"
              @confirm="resetPassword(scope.row)">
            <template #reference>
              <el-button type="warning">重置密码</el-button>
            </template>
          </el-popconfirm>
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

    <el-dialog title="用户信息" v-model:visible="dialogFormVisible">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="form.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.ustuNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.unickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.uphone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.uemail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录账号">
          <el-input v-model="form.uloginName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-popover style="margin-left: 40px;" placement="right" width="300" trigger="click">
        <el-radio v-model="form.utype" label="1">学生</el-radio>
        <el-radio v-model="form.utype" label="2">教师</el-radio>
        <el-radio v-model="form.utype" label="3">教室管理员</el-radio>
        <el-radio v-model="form.utype" label="4">系统管理员</el-radio>
        <template #reference>
          <el-button>更改用户类型</el-button>
        </template>
      </el-popover>
      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'User',
  data() {
    return {
      tableData: [],
      loading: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      form: {},
      multipleSelection: [],
      u_name: '',
      u_stu_num: '',
      u_nickname: '',
      u_phone: '',
      u_email: '',
      u_type: '',
      u_login_name: '',
      dialogFormVisible: false,
      options: [
        { label: '学生', value: 1 },
        { label: '教师', value: 2 },
        { label: '教室管理员', value: 3 },
        { label: '系统管理员', value: 4 }
      ],
      getType: [
        { dictValue: 1, dictLabel: '学生' },
        { dictValue: 2, dictLabel: '教师' },
        { dictValue: 3, dictLabel: '教室管理员' },
        { dictValue: 4, dictLabel: '系统管理员' }
      ]
    }
  },
  created() {
    this.load()
  },
  methods: {
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleDialogCancel() {
      this.dialogFormVisible = false
    },
    handleEdit(row) {
      this.form = { ...row }
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      request.delete('/user/' + row.uid).then((res) => {
        if (res.code === '200') {
          this.$message.success('删除成功！')
          this.load()
        } else if (res.code === '600') {
          this.$confirm('当前用户已经存在预约，继续删除将会删除所有与该用户相关的预约，确认删除？', '确认删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            request.delete('/user/force/' + row.uid).then((res2) => {
              if (res2.code === '200') {
                this.$message({ type: 'success', message: '删除成功!' })
                this.reset()
              } else {
                this.$message.error(res2.msg)
              }
            })
          }).catch(() => {})
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    resetPassword(row) {
      request.post('/user/reset/pwd/' + row.uid).then((res) => {
        if (res) {
          this.$message.success('操作成功！')
          this.load()
        } else {
          this.$message.error('操作失败！请稍后再试')
        }
      })
    },
    delBatch() {
      const u_ids = this.multipleSelection.map((v) => v.uid)
      request.post('/user/del/batch/', u_ids).then((res) => {
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
      this.multipleSelection = val
    },
    reset() {
      this.u_name = ''
      this.u_stu_num = ''
      this.u_nickname = ''
      this.u_phone = ''
      this.u_email = ''
      this.u_type = ''
      this.u_login_name = ''
      this.load()
    },
    async load() {
      this.loading = true
      await request.get('/user/page', {
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
      }).then((res) => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
      this.loading = false
    },
    save() {
      request.post('/user', this.form).then((res) => {
        if (res) {
          this.dialogFormVisible = false
          this.$message.success('保存成功！')
          this.load()
        } else {
          this.$message.error('保存失败！请稍后再试')
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
    getLabel(list, id, value, label) {
      if (id !== '' && Array.isArray(list) && list.length !== 0) {
        const found = list.find((item) => item[value] == id)
        return found ? found[label] : id
      }
      return id
    },
    getTagType(utype) {
      if (utype === 1) return ''
      if (utype === 2) return 'success'
      if (utype === 3) return 'warning'
      if (utype === 4) return 'danger'
      return ''
    }
  }
}
</script>

<style scoped></style>
