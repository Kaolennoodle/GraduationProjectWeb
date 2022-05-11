<template>
<div>
  <el-breadcrumb separator="/" style="margin-bottom: 10px">
    <el-breadcrumb-item :to="{ path: '/classroom-admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>系统设置</el-breadcrumb-item>
  </el-breadcrumb>
</div>
</template>

<script>
export default {
  name: "ClassroomAdminSettings"
}
</script>

<style scoped>

</style>