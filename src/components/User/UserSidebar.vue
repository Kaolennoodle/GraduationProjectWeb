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
        <span slot="title">我的预约</span>
      </template>
      <el-menu-item index="/user/appointment"><i class="el-icon-school"></i>教室预约</el-menu-item>
      <el-menu-item index="/user/dashboard"><i class="el-icon-user"></i>教室状态</el-menu-item>
    </el-submenu>
    <el-menu-item index="/user/settings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">系统设置</span>
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