<template>
  <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
      router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../../assets/logo.png" alt="" style="width: 40px; margin-top: 15px" />
    </div>

    <el-menu-item index="/classroom-admin/home">
      <span>主页</span>
    </el-menu-item>
    <el-sub-menu index="/appointment">
      <template #title>
        <span>预约管理</span>
      </template>
      <el-menu-item index="/classroom-admin/new-appointment">新增预约</el-menu-item>
      <el-menu-item index="/classroom-admin/appointment">现存预约</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/classroom">
      <template #title>
        <span>我的教室</span>
      </template>
      <el-menu-item index="/classroom-admin/classroom-info">教室信息</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/classroom-admin/message">
      <span>消息中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'ClassroomAdminSideBar',
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped></style>
