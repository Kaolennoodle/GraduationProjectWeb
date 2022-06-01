<template>

  <el-menu class="el-menu-vertical-demo"
           :collapse="isCollapse"
           style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
           router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../../assets/logo.png" alt="" style="width: 40px; margin-top: 15px">
    </div>

    <!--    左侧菜单-->
    <el-menu-item index="/user/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-submenu index="/user">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span slot="title">教室预约</span>
      </template>
      <el-menu-item index="/user/appointment"><i class="el-icon-school"></i>新建预约</el-menu-item>
      <el-menu-item index="/user/my-appointment"><i class="el-icon-user"></i>我的预约</el-menu-item>
    </el-submenu>
    <el-menu-item index="/user/message">
      <i class="el-icon-s-comment"></i>
      <span slot="title">消息中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "UserSideBar",
  props: {
    isCollapse: Boolean
  },
  methods: {
  }
}
</script>

<style scoped>

</style>