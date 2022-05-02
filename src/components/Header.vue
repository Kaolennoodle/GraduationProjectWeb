<template>

  <div>
    <div style="text-align: left; font-size: 12px; display: flex;">
      <div style="flex: 1; font-size: 18px">
        <span :class="collapseBtnClass" style="cursor: pointer; color: white" @click="changeCollapse">  智能教室管理系统</span>

      </div>
      <el-dropdown style="cursor: pointer; margin: auto 10px auto auto">
        <el-avatar :size="35" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                   style="margin-top: 13px"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <span style="text-decoration: none" @click="editInfo"><el-dropdown-item>个人信息</el-dropdown-item></span>
          <span style="text-decoration: none" @click="logout"><el-dropdown-item>退出登录</el-dropdown-item></span>
        </el-dropdown-menu>
      </el-dropdown>

      <span style="color: white;
    font-size: 15px">{{ user.unickname }}</span>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Header",
  props: ['collapseBtnClass'],
  data() {
    return {
      paths: [],
      user: {},
      form: {},
      dialogFormVisible: false
    }
  },
  created() {
    this.loadCurrentUser()
  },
  methods: {
    /**
     * 改变侧边栏收缩
     */
    changeCollapse() {
      this.$bus.$emit('changeCollapse')
    },

    loadCurrentUser() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")): {}
    },

    logout() {
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    },

    editInfo() {
      this.$bus.$emit('editInfo')
      console.log("触发了全局总线中的editInfo事件")
    },

    save() {

    },
  },
  mounted() {
    this.$bus.$on('loadCurrentUser', (data) => {
      this.loadCurrentUser()
    })
  }
}
</script>

<style>
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>

<style scoped>

</style>