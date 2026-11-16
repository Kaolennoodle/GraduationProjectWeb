<template>
  <div class="limiter">
    <div class="container-login">
      <div class="login-box">
        <form class="login-form validate-form">
          <span class="login-form-title" style="margin-bottom: 35px; margin-top: 0px">
            <img class="login-form-logo" src="../assets/logo.png" width="80px" height="80px"
                 style="background-color: #fff;" />
          </span>
          <span class="login-form-title" style="margin-top: 20px; margin-bottom: 30px">欢迎来到蓝星智能教室</span>
          <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
            <el-form-item prop="uloginName">
              <el-input v-model="ruleForm.uloginName" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="upassword">
              <el-input v-model="ruleForm.upassword" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 50px">
              <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
              <el-divider></el-divider>
              <div style="margin-left: 40%">
                <span class="txt1">还没账号?</span>
              </div>
              <el-button style="width: 100%" @click="$router.push('/register')">注册</el-button>
            </el-form-item>
          </el-form>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

var validateLoginName = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    callback(new Error('账号不能为空'))
  } else {
    callback()
  }
}

export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        uloginName: '',
        upassword: ''
      },
      rules: {
        uloginName: [{ validator: validateLoginName, trigger: 'blur' }],
        upassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度应在8到20个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (valid) {
          request.post('/login', this.ruleForm).then((res) => {
            if (res.code === '200') {
              localStorage.setItem('user', JSON.stringify(res.data))
              const utype = res.data.utype
              if (utype === 4) {
                this.$router.push('/manager')
              } else if (utype === 3) {
                this.$router.push('/classroom-admin')
              } else if (utype === 1 || utype === 2) {
                this.$router.push('/user')
              }
              this.$notify({
                title: '登录成功',
                message: '祝您使用愉快！',
                position: 'bottom-right',
                duration: 2000,
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
input {
  outline: none;
  border: none;
}
button,
input {
  overflow: visible;
}
button {
  outline: none !important;
  border: none;
  background: transparent;
}
a {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
  transition: all 0.4s;
  text-decoration: none;
}
.limiter {
  width: 100%;
  margin: 0 auto;
}
.container-login {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-image: linear-gradient(to bottom right, rgb(13, 68, 200), rgb(33, 147, 255));
}
.login-box {
  width: 390px;
  background: #fff;
  border-radius: 10px;
  margin: 0 auto;
  overflow: hidden;
  padding: 77px 55px 33px 55px;
  box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
}
.login-form {
  width: 100%;
}
.login-form-title {
  display: block;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  font-size: 25px;
  color: #333333;
  line-height: 1.2;
  text-align: center;
}
.txt1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}
</style>
