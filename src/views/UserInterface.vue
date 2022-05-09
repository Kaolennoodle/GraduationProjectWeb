<template>
  <div>


    <!--  左侧菜单栏-->
    <el-container style="min-height: 100vh">

      <UserSideBar :isCollapse="this.isCollapse"/>

      <el-container>

        <!--        顶部导航栏-->
        <el-header
            style="background-color: #DDEBFF; border-bottom: 1px solid #ccc">
          <Header :collapseBtnClass="collapseBtnClass"/>
        </el-header>


        <!--      主框体-->
        <el-main>

          <!--        表示当前页面的子路由会在router-view里面展示-->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>

    <!--        编辑个人资料窗口-->
    <el-dialog title="个人信息" :visible.sync="infoDialogVisible">

      <div style="float: left; margin-left: 50px; margin-top: 40px">
        <el-tooltip class="item" effect="light" content="点击上传新头像" placement="top">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8081/file/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tooltip>
      </div>

      <div>
        <el-form :inline="true" label-width="80px" size="small" style="margin-top: 20px; margin-left: 160px;">
          <el-form-item label="昵称">
            <el-input v-model="userInfo.unickname" autocomplete="off" suffix-icon="el-icon-chat-dot-round"
                      style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="userInfo.uname" autocomplete="off" suffix-icon="el-icon-user"
                      style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="userInfo.ustuNum" autocomplete="off" suffix-icon="el-icon-s-custom"
                      style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="userInfo.uphone" autocomplete="off" suffix-icon="el-icon-mobile-phone"
                      style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.uemail" autocomplete="off" suffix-icon="el-icon-message"
                      style="width: 170px"></el-input>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="userInfo.uloginName" autocomplete="off" suffix-icon="el-icon-mouse"
                      style="width: 170px"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click="saveUserInfo">确 定</el-button>
      </div>
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

/*头像上传相关*/
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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


import UserSideBar from "@/components/User/UserSidebar";
import Header from "@/components/Header";
import request from "@/utils/request";

export default {
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      infoDialogVisible: false,
      userInfo: [],
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      form: {},

      // 头像路径
      imageUrl: ''
    }
  },
  methods: {
    handleDialogCancel() {
      this.infoDialogVisible = false
    },
    saveUserInfo() {
      request.post("/user", this.userInfo).then(res => {
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
          localStorage.setItem("user", JSON.stringify(this.user))
          this.$bus.$emit('loadCurrentUser')
        } else {
          this.$message.error({
            showClose: true,
            message: "保存失败！请稍后再试"
          })
        }
      })

    },

    /**
     * 头像上传相关
     * @param res
     * @param file
     */
    handleAvatarSuccess(res, file) {
      this.imageUrl = res;
      this.userInfo.uavatarPath = this.imageUrl
      this.$notify({
        title: '头像上传成功',
        message: '点击确认保存头像',
        position: 'bottom-right',
        duration: 2000,
        type: 'success'
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isWEBP = file.type === 'image/webp';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isPNG || isWEBP)) {
        this.$message.error('上传头像图片只能是 JPG、PNG或WEBP 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG || isWEBP) && isLt2M;
    }
  },
  components: {
    UserSideBar,
    Header
  },
  mounted() {
    this.$bus.$on('changeCollapse', (data) => {
      if (this.isCollapse == true) {
        this.isCollapse = false
        this.collapseBtnClass = 'el-icon-s-fold'
      } else if (this.isCollapse == false) {
        this.isCollapse = true
        this.collapseBtnClass = 'el-icon-s-unfold'
      }
    })

    this.$bus.$on('editInfo', async (data) => {
      await request.get("http://localhost:8081/user/page", {
        params: {
          pageNum: 1,
          pageSize: 10,
          u_id: this.user.uid,
        }
      }).then(res => {
        this.userInfo = res.data.records[0]
      })
      this.imageUrl = this.userInfo.uavatarPath
      this.infoDialogVisible = true
    })
  }
}
</script>
