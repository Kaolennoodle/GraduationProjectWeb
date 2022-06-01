<template>

  <div>
    <div style="text-align: left; font-size: 12px; display: flex;">
      <div style="flex: 1; font-size: 18px">
        <span :class="collapseBtnClass" style="cursor: pointer; color: white" @click="changeCollapse">  智能教室管理系统</span>

      </div>
      <el-dropdown style="cursor: pointer; margin: auto 10px auto auto">
        <el-avatar :size="35" :src="user.uavatarPath"
                   style="margin-top: 13px"
                   @error="avatarErrorHandler"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <span style="text-decoration: none" @click="editInfo"><el-dropdown-item>个人信息</el-dropdown-item></span>
          <span style="text-decoration: none" @click="openPasswordChangingDialog"><el-dropdown-item>修改密码</el-dropdown-item></span>
          <span style="text-decoration: none" @click="logout"><el-dropdown-item>退出登录</el-dropdown-item></span>
        </el-dropdown-menu>
      </el-dropdown>

      <span style="color: white;
    font-size: 15px">{{ user.unickname }}</span>
    </div>

    <el-dialog title="修改密码" :visible.sync="passwordChangingDialogVisible">
      <el-form :model="form">
        <el-form-item label="旧密码">
          <el-input type="password" v-model="password.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="password.newPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordChangingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Header",
  props: ['collapseBtnClass'],
  data() {
    return {
      paths: [],
      user: {},
      form: {},
      dialogFormVisible: false,
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
  methods: {
    /**
     * 改变侧边栏收缩
     */
    changeCollapse() {
      this.$bus.$emit('changeCollapse')
    },

    loadCurrentUser() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")): {}
    },

    logout() {
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$notify({
        title: '退出成功',
        message: '您已安全退出',
        position: 'bottom-right',
        duration: 2000,
        type: 'success'
      });
    },

    editInfo() {
      this.$bus.$emit('editInfo')
    },

    avatarErrorHandler() {
      if(this.user.uavatarPath === "")
        return true
    },

    /**
     * 修改密码
     */
    changePassword() {
      this.password.uid = this.user.uid
      console.log(this.password)
      request.post("/user/change-password", this.password).then(res => {
        if (res.code === '200') {
          this.$message.success({
            showClose: true,
            message: "修改成功！请重新登录！"
          })
          this.passwordChangingDialogVisible = false
          this.$router.push("/login")
        } else if (res.code === '600') {
          this.$message.error({
            showClose: true,
            message: "旧密码错误，请重试！"
          })
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })
    },

    /**
     * 打开修改密码对话框
     */
    openPasswordChangingDialog() {
      this.passwordChangingDialogVisible = true
    }
  },
  mounted() {
    this.$bus.$on('loadCurrentUser', (data) => {
      this.loadCurrentUser()
    })
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
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

<style scoped>

</style>