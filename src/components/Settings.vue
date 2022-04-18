<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/vue/public">系统设置</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-empty description="网站建设中……"></el-empty>
  </div>


</template>

<script>
export default {
  name: "Settings"
}
</script>

<style scoped>

</style>