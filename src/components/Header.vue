<template>
  <div>
    <div style="text-align: left; font-size: 12px; display: flex;">
      <div style="flex: 1; font-size: 18px">
        <span style="cursor: pointer; color: white" @click="changeCollapse">智能教室管理系统</span>
      </div>
      <el-dropdown style="cursor: pointer; margin: auto 10px auto auto" @command="handleMenuCommand">
        <el-avatar :size="35" :src="user.uavatarPath" style="margin-top: 13px" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="editInfo">个人信息</el-dropdown-item>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span style="color: white; font-size: 15px">{{ user.unickname }}</span>
    </div>

    <el-dialog title="修改密码" v-model:visible="passwordChangingDialogVisible">
      <el-form :model="form">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="password.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="password.newPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordChangingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'Header',
  props: ['collapseBtnClass'],
  data() {
    return {
      user: {},
      form: {},
      passwordChangingDialogVisible: false,
      password: {
        uid: '',
        oldPassword: '',
        newPassword: ''
      }
    }
  },
  created() {
    this.loadCurrentUser()
  },
  mounted() {
    this.$bus.on('loadCurrentUser', () => {
      this.loadCurrentUser()
    })
  },
  beforeUnmount() {
    this.$bus.off('loadCurrentUser')
  },
  methods: {
    changeCollapse() {
      this.$bus.emit('changeCollapse')
    },
    loadCurrentUser() {
      this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    },
    logout() {
      this.$router.push('/login')
      localStorage.removeItem('user')
      this.$notify({
        title: '退出成功',
        message: '您已安全退出',
        position: 'bottom-right',
        duration: 2000,
        type: 'success'
      })
    },
    editInfo() {
      this.$bus.emit('editInfo')
    },
    openPasswordChangingDialog() {
      this.passwordChangingDialogVisible = true
    },
    handleMenuCommand(command) {
      if (command === 'editInfo') this.editInfo()
      else if (command === 'changePassword') this.openPasswordChangingDialog()
      else if (command === 'logout') this.logout()
    },
    changePassword() {
      this.password.uid = this.user.uid
      request.post('/user/change-password', this.password).then((res) => {
        if (res.code === '200') {
          this.$message.success('修改成功！请重新登录！')
          this.passwordChangingDialogVisible = false
          this.$router.push('/login')
        } else if (res.code === '600') {
          this.$message.error('旧密码错误，请重试！')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
</style>
