<template>

  <el-menu class="el-menu-vertical-demo"
           :collapse="isCollapse"
           style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
           router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../../assets/logo.png" alt="" style="width: 40px; margin-top: 15px">
    </div>

    <!--    左侧菜单-->
    <el-menu-item index="/classroom-admin/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-submenu index="/appointment">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span slot="title">预约管理</span>
      </template>
      <el-menu-item index="/classroom-admin/new-appointment">
        <i class="el-icon-s-order"></i>新增预约
      </el-menu-item>
      <el-menu-item index="/classroom-admin/appointment"><i class="el-icon-s-claim"></i>现存预约</el-menu-item>
    </el-submenu>
    <el-submenu index="/classroom">
      <template slot="title">
        <i class="el-icon-s-grid"></i>
        <span slot="title">我的教室</span>
      </template>
      <el-menu-item index="/classroom-admin/classroom-info"><i class="el-icon-s-data"></i>教室信息</el-menu-item>
      <el-menu-item index="/classroom-admin/classroom-status"><i class="el-icon-s-operation"></i>教室状态</el-menu-item>
    </el-submenu>
    <el-menu-item index="/classroom-admin/message">
      <i class="el-icon-s-comment"></i>
      <span slot="title">消息中心</span>
    </el-menu-item>
    <el-menu-item index="/classroom-admin/settings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">系统设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "ClassroomAdminSideBar",
  props: {
    isCollapse: Boolean
  },
  methods: {}
}
</script>

<style scoped>

</style>