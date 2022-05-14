<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator="/" style="margin-bottom: 10px">
      <el-breadcrumb-item :to="{ path: '/user/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息中心</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card style="margin-top: 20px; margin-bottom: 10px; width: 100vh">

      <h5 v-if="unreadMessageNum === 0">您当前没有新的未读消息</h5>
      <h4 v-if="unreadMessageNum > 0">
        您当前有{{ unreadMessageNum }}条新的未读消息
        <el-button plain @click="handleReadAll" style="margin-left: 10px;" v-if="unreadMessageNum !== 0">全部已读</el-button>
      </h4>

      <el-collapse v-model="activeName" accordion style="margin-top: 20px;">
        <el-collapse-item v-for="(message, i) in messageList" :name="i">
          <template slot="title">
            <span>{{ message.mtitle }}</span>
            <el-tag
                v-if="message.mstatus === 1"
                style="margin-left: 15px;"
                key="NEW"
                type="danger"
                effect="dark">
              NEW
            </el-tag>
            <span style="margin-right: 20px; position: absolute; left: 107vh" >{{ dateFormat(message.mcreateTime) }}</span>
          </template>
          <div>
            {{ message.mcontent }}
            <el-button plain @click="handleRead(message.mid)" style="margin-left: 10px;" v-if="message.mstatus !== 2">已读</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>

    </el-card>


  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Message",
  data() {
    return {
      messageList: [],
      unreadMessageNum: 0,
      user: {},

      //折叠面板参数
      activeName: ""
    }
  },
  async created() {
    await this.loadCurrentUser()
    await this.load()
  },
  methods: {
    async load() {
      await request.get("/message/get-by-receiver/" + this.user.uid).then(res => {
        if (res.code === '200') {
          this.messageList = res.data
        } else
          this.$message.error({
            showClose: true,
            message: res.msg
          })
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

    dateFormat(time) {
      let date = new Date(time)
      let now = new Date()

      let dateYear = date.getFullYear()
      let dateMonth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dateDay = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let dateHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let dateMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

      let nowYear = now.getFullYear()
      let nowMonth = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
      let nowDay = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
      // let nowHours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      // let nowMinutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();

      let res = dateHours + ":" + dateMinutes

      if (dateYear !== nowYear) {
        res = dateYear + "-" + dateMonth + "-" + dateDay + " " + res
      } else if (dateDay !== nowDay || dateMonth !== nowMonth) {
        res = dateMonth + "-" + dateDay + " " + res
      }

      return res

      // let dateSeconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    },

    handleRead(mid) {
      request.post("/message/read/" + mid).then(res => {
        if (res.code === '200') {
          this.load()
        }
        else
          this.$message.error({
            showClose: true,
            message: res.msg
          })
      })
    },

    /**
     * 一键已读
     */
    handleReadAll() {
      request.post("/message/read-all/" + this.user.uid).then(res => {
        if (res.code === '200') {
          this.load()
        }
        else
          this.$message.error({
            showClose: true,
            message: res.msg
          })
      })
    }
  }
}
</script>

<style scoped>

</style>