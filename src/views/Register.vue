<template>
  <div class="limiter">
    <div class="container-login">
      <div class="login-box">
        <form class="login-form validate-form">
          <span class="login-form-title" style="margin-bottom: 35px; margin-top: 0px">
            <img class="login-form-logo" src="../assets/logo.png" width="80px" height="80px"
                 style="background-color: #fff;" />
          </span>
          <span class="login-form-title" style="margin-top: 20px; margin-bottom: 30px">用户注册</span>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef">
            <el-form-item prop="uloginName">
              <el-input v-model="ruleForm.uloginName" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="upassword">
              <el-input type="password" v-model="ruleForm.upassword" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 50px">
              <el-button type="primary" style="width: 100%" @click="register">注册</el-button>
              <el-divider></el-divider>
              <div style="margin-left: 40%">
                <span class="txt1">已有账号?</span>
              </div>
              <el-button style="width: 100%" @click="$router.push('/login')">登录</el-button>
            </el-form-item>
          </el-form>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'Register',
  data() {
    const validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.upassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const validateLoginName = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
      }
    }

    return {
      ruleForm: {
        uloginName: '',
        upassword: '',
        checkPass: ''
      },
      rules: {
        uloginName: [{ validator: validateLoginName, trigger: 'blur' }],
        upassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度应在8到20个字符', trigger: 'blur' }
        ],
        checkPass: [{ validator: validateCheckPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    register() {
      this.$refs['ruleFormRef'].validate((valid) => {
        if (valid) {
          request.post('/user/register', this.ruleForm).then((res) => {
            if (res.code === '200') {
              this.$router.push('/login')
              this.$message.success('注册成功')
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
