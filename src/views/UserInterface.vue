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

    <!--        新增/编辑用户信息窗口-->
    <el-dialog title="用户信息" :visible.sync="infoDialogVisible">
      <el-form :inline="true" label-width="80px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="userInfo.uname" autocomplete="off" suffix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="userInfo.ustuNum" autocomplete="off" suffix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="userInfo.unickname" autocomplete="off" suffix-icon="el-icon-chat-dot-round"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userInfo.uphone" autocomplete="off" suffix-icon="el-icon-mobile-phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.uemail" autocomplete="off" suffix-icon="el-icon-message"></el-input>
        </el-form-item>
        <!--        <el-form-item label="用户类型">-->
        <!--          <el-select v-model="form.utype" placeholder="用户类型">-->
        <!--            <el-option-->
        <!--                v-for="item in options2"-->
        <!--                :key="item.value"-->
        <!--                :label="item.label"-->
        <!--                :value="item.value">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="登录账号">
          <el-input v-model="userInfo.uloginName" autocomplete="off" suffix-icon="el-icon-mouse"></el-input>
        </el-form-item>
      </el-form>

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
      form: {}
    }
  },
  methods: {
    handleDialogCancel() {
      this.infoDialogVisible = false
    },
    saveUserInfo() {
      request.post("/user", this.userInfo).then(res => {
        if (res) {
          this.infoDialogVisible = false
          this.$message.success({
            showClose: true,
            message: "保存成功！"
          })
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

    this.$bus.$on('editInfo', (data) => {
      console.log("响应了editInfo事件");
      console.log(this.user.uid)
      request.get("http://localhost:8081/user/page", {
        params: {
          pageNum: 1,
          pageSize: 10,
          u_id: this.user.uid,
        }
      }).then(res => {
        this.userInfo = res.data.records[0]
      })
      this.infoDialogVisible = true
    })
  }
}
</script>
