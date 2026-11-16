<template>
  <div>
    <el-container style="min-height: 100vh">
      <UserSideBar :isCollapse="isCollapse" />
      <el-container>
        <el-header style="background-color: #DDEBFF; border-bottom: 1px solid #ccc">
          <Header :collapseBtnClass="collapseBtnClass" />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="个人信息" v-model:visible="infoDialogVisible">
      <div style="float: left; margin-left: 50px; margin-top: 40px">
        <el-tooltip effect="light" content="点击上传新头像" placement="top">
          <el-upload
              class="avatar-uploader"
              action="/api/file/upload"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-tooltip>
      </div>

      <div>
        <el-form :inline="true" label-width="80px" size="small" style="margin-top: 20px; margin-left: 160px;">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.unickname" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="userInfo.uname" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="userInfo.ustuNum" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.uphone" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.uemail" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="userInfo.uloginName" autocomplete="off" style="width: 170px"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.el-header {
  background-image: linear-gradient(to bottom right, rgb(13, 68, 200), rgb(33, 147, 255));
  line-height: 60px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

<script>
import UserSideBar from '@/components/User/UserSidebar.vue'
import Header from '@/components/Header.vue'
import request from '@/utils/request'

export default {
  components: { UserSideBar, Header },
  data() {
    return {
      collapseBtnClass: 'fold',
      isCollapse: false,
      infoDialogVisible: false,
      userInfo: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
      imageUrl: ''
    }
  },
  computed: {
    uploadHeaders() {
      const raw = localStorage.getItem('user')
      if (raw) {
        try {
          return { token: JSON.parse(raw).token }
        } catch {}
      }
      return {}
    }
  },
  mounted() {
    this.$bus.on('changeCollapse', () => {
      this.isCollapse = !this.isCollapse
      this.collapseBtnClass = this.isCollapse ? 'unfold' : 'fold'
    })

    this.$bus.on('editInfo', async () => {
      await request.get('/user/page', {
        params: { pageNum: 1, pageSize: 10, u_id: this.user.uid }
      }).then((res) => {
        this.userInfo = res.data.records[0]
      })
      this.imageUrl = this.userInfo.uavatarPath || ''
      this.infoDialogVisible = true
    })
  },
  beforeUnmount() {
    this.$bus.off('changeCollapse')
    this.$bus.off('editInfo')
  },
  methods: {
    handleDialogCancel() {
      this.infoDialogVisible = false
    },
    saveUserInfo() {
      request.post('/user', this.userInfo).then((res) => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '您的信息已成功保存',
            position: 'bottom-right',
            duration: 2000,
            type: 'success'
          })
          this.infoDialogVisible = false
          this.user.uavatarPath = this.userInfo.uavatarPath
          this.user.unickname = this.userInfo.unickname
          this.user.uloginName = this.userInfo.uloginName
          localStorage.setItem('user', JSON.stringify(this.user))
          this.$bus.emit('loadCurrentUser')
        } else {
          this.$message.error('保存失败！请稍后再试')
        }
      })
    },
    handleAvatarSuccess(res) {
      this.imageUrl = res
      this.userInfo.uavatarPath = this.imageUrl
      this.$notify({
        title: '头像上传成功',
        message: '点击确认保存头像',
        position: 'bottom-right',
        duration: 2000,
        type: 'success'
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isWEBP = file.type === 'image/webp'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!(isJPG || isPNG || isWEBP)) {
        this.$message.error('上传头像图片只能是 JPG、PNG或WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isWEBP) && isLt2M
    }
  }
}
</script>
