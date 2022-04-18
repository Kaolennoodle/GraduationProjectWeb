<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item>首页</el-breadcrumb-item>

    </el-breadcrumb>
    <el-empty description="网站建设中……">
      <router-link to="/classroom">
        <el-button type="primary">进入教室管理</el-button>
      </router-link>
      <router-link to="/user" style="margin-left: 5px">
        <el-button type="primary">进入用户管理</el-button>
      </router-link>


    </el-empty>
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>

</style>