<template>
  <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
      router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../../assets/logo.png" alt="" style="width: 40px; margin-top: 15px" />
    </div>

    <el-menu-item index="/manager/home">
      <span>主页</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/manager/classroom">教室信息管理</el-menu-item>
      <el-menu-item index="/manager/user">用户信息管理</el-menu-item>
      <el-menu-item index="/manager/appointment">预约信息管理</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/manager/message">
      <span>消息中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped></style>
