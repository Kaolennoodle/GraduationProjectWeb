<template>

  <el-menu class="el-menu-vertical-demo"
           :collapse="isCollapse"
           style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
           router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../assets/logo.png" alt="" style="width: 40px; margin-top: 15px">
    </div>

    <!--    左侧菜单-->
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="/classroom"><i class="el-icon-school"></i>教室信息管理</el-menu-item>
      <el-menu-item index="/user"><i class="el-icon-user"></i>用户信息管理</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-s-order"></i>
        <span slot="title">使用记录</span>
      </template>
      <el-menu-item index="/log">暂未开放</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-s-tools"></i>
        <span slot="title">系统设置</span>
      </template>
      <el-menu-item index="/settings">暂未开放</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    isCollapse: Boolean
  },
  methods: {
  }
}
</script>

<style scoped>

</style>