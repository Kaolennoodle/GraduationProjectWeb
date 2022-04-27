<template>
<div>
  <el-breadcrumb separator="/" style="margin-bottom: 10px">
    <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>我的预约</el-breadcrumb-item>
    <el-breadcrumb-item>教室状态</el-breadcrumb-item>
  </el-breadcrumb>
</div>
</template>

<script>
export default {
  name: "UserDashboard"
}
</script>

<style scoped>

</style>