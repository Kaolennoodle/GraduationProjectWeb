<template>
  <div>
    <el-card>
      <h4>消息中心</h4>
      <h5 v-if="unreadMessageNum === 0">您当前没有新的未读消息</h5>
      <p v-if="unreadMessageNum > 0">
        您当前有{{ unreadMessageNum }}条新的未读消息
      </p>
      <el-badge :value=unreadMessageNum style="margin-top: 10px" :hidden="unreadMessageNum === 0" class="item">
        <el-button size="small" @click="jumpToMessage">点击查看</el-button>
      </el-badge>
    </el-card>
    <el-row style="margin-top: 20px;" :gutter="10">
      <el-col :span="6">
        <el-card>
          <p>用户数量</p>
          <span style="font-size: 50px; float: right; color: #6a7dfe">{{ userNum }}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <p>教室数量</p>
          <span style="font-size: 50px; float: right; color: #8a2aa5">{{ classroomNum }}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <p>现存预约</p>
          <span style="font-size: 50px; float: right; color: #2aa56e">{{ activeAppointmentNum }}</span>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <p>全部预约</p>
          <span style="font-size: 50px; float: right; color: #a52a2a">{{ allAppointmentNum }}</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;" :gutter="10">
      <el-col :span="6">
        <el-card>
          <el-progress type="dashboard" :percentage="this.activeUserRatio" :color="colors"></el-progress>
          <p>活跃用户占比</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-progress type="dashboard" :percentage="this.activeClassroomRatio"
                       :color="colors"></el-progress>
          <p>活跃教室占比</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-progress type="dashboard" :percentage="this.occupiedTimeRatio1" :color="colors"></el-progress>
          <p>近一天教室占用率</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-progress type="dashboard" :percentage="this.occupiedTimeRatio5" :color="colors"></el-progress>
          <p>近五天教室占用率</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "ClassroomAdminHome",
  data() {
    return {
      user: {},
      userNum: "",
      classroomNum: "",
      activeAppointmentNum: "",
      allAppointmentNum: "",
      occupiedTimeRatio1: 0,
      occupiedTimeRatio5: 0,
      activeClassroomNum: 0,
      activeClassroomRatio: 0,
      activeUserRatio: 0,
      unreadMessageNum: 0,
      colors: [
        {color: '#5cb87a', percentage: 30},
        {color: '#e6a23c', percentage: 50},
        {color: '#f56c6c', percentage: 70},
      ]
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loadCurrentUser()
      request.get("/user/num").then(res => {
        if (res.code === '200') {
          this.userNum = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/classroom/num").then(res => {
        if (res.code === '200') {
          this.classroomNum = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/appointment/active-num").then(res => {
        if (res.code === '200') {
          this.activeAppointmentNum = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/appointment/all-num").then(res => {
        if (res.code === '200') {
          this.allAppointmentNum = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/appointment/ocpt-ratio-1").then(res => {
        if (res.code === '200') {
          this.occupiedTimeRatio1 = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/appointment/ocpt-ratio-5").then(res => {
        if (res.code === '200') {
          this.occupiedTimeRatio5 = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/classroom/active-ratio").then(res => {
        if (res.code === '200') {
          this.activeClassroomRatio = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/user/active-ratio").then(res => {
        if (res.code === '200') {
          this.activeUserRatio = res.data
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg
          })
        }
      })

      request.get("/message/get-unread-num/" + this.user.uid).then(res => {
        if (res.code === "200") {
          this.unreadMessageNum = res.data
        } else
          this.$message.error({
            showClose: true,
            message: res.msg
          })
      })
    },

    loadCurrentUser() {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    },
    jumpToMessage() {
      this.$router.push("/classroom-admin/message")
    }
  }
}
</script>

<style scoped>

</style>