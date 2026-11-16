<template>
  <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      style="min-height: 100%; box-shadow: 2px 0 6px rgb(150 150 150)"
      router>
    <div style="height: 60px; line-height: 60px; text-align: center;">
      <img src="../../assets/logo.png" alt="" style="width: 40px; margin-top: 15px" />
    </div>

    <el-menu-item index="/user/home">
      <span>主页</span>
    </el-menu-item>
    <el-sub-menu index="/user">
      <template #title>
        <span>教室预约</span>
      </template>
      <el-menu-item index="/user/appointment">新建预约</el-menu-item>
      <el-menu-item index="/user/my-appointment">我的预约</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/user/message">
      <span>消息中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'UserSideBar',
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped></style>
