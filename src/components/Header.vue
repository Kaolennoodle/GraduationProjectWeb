<template>

  <div style="text-align: left; font-size: 12px; display: flex;">
    <div style="flex: 1; font-size: 18px">
      <span :class="collapseBtnClass" style="cursor: pointer; color: white" @click="changeCollapse">  智能教室管理系统</span>

    </div>
    <el-dropdown style="cursor: pointer">
      <i class="el-icon-setting" style="margin-right: 15px"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span>张浩男</span>
  </div>
</template>

<script>

export default {
  name: "Header",
  props: ['collapseBtnClass'],
  data() {
    return {
      paths: []
    }
  },
  methods: {
    changeCollapse() {
      this.$bus.$emit('changeCollapse')
    }
  }
}
</script>

<style scoped>

</style>