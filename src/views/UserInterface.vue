<template>


  <!--  左侧菜单栏-->
  <el-container style="min-height: 100vh">

    <UserSideBar :isCollapse="this.isCollapse"/>

    <el-container>

      <!--        顶部导航栏-->
      <el-header
          style="background-color: #DDEBFF; border-bottom: 1px solid #ccc">
        <Header :collapseBtnClass="collapseBtnClass"/>
      </el-header>


      <!--      主框体-->
      <el-main>

        <!--        表示当前页面的子路由会在router-view里面展示-->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>

</template>

<style>

.el-header {
  background-image: linear-gradient(to bottom right, rgb(13, 68, 200), rgb(33, 147, 255));

  line-height: 60px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>

<script>


import UserSideBar from "@/components/User/UserSidebar";
import Header from "@/components/Header";

export default {
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
    }
  },
  components: {
    UserSideBar,
    Header
  },
  mounted() {
    this.$bus.$on('changeCollapse', (data) => {
      if (this.isCollapse == true) {
        this.isCollapse = false
        this.collapseBtnClass = 'el-icon-s-fold'
      } else if (this.isCollapse == false) {
        this.isCollapse = true
        this.collapseBtnClass = 'el-icon-s-unfold'
      }
    })
  }
}
</script>
