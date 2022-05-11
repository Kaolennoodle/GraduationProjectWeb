<template>
  <div>
    <head>
      <title>Login</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex, follow">
    </head>
    <body>
    <div class="limiter">
      <div class="container-login">
        <div class="login-box">
          <form class="login-form validate-form">
            <span class="login-form-title" style="margin-bottom: 35px; margin-top: 0px">
                <img class="login-form-logo" src="../assets/logo.png" width="80px" height="80px"
                     style="background-color: #fff;"/>
            </span>
            <span class="login-form-title" style="margin-top: 20px; margin-bottom: 30px">欢迎来到蓝星智能教室</span>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
              <el-form-item prop="username" size="medium">
                <el-input prefix-icon="el-icon-user" v-model="ruleForm.uloginName" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password" size="medium">
                <el-input prefix-icon="el-icon-lock" v-model="ruleForm.upassword" placeholder="请输入密码"
                          show-password></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 50px">
                <el-button type="primary" size="medium" style="width: 100%" @click="login">登录</el-button>
                <el-divider></el-divider>
                <div style="margin-left: 40%">
                  <span class="txt1">还没账号?</span>
                </div>
                <el-button size="medium" style="width: 100%" @click="$router.push('/register')">注册</el-button>
              </el-form-item>
            </el-form>

          </form>
        </div>
      </div>
    </div>
    </body>
  </div>
</template>
<script>

import request from "@/utils/request";

export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        uloginName: '',
        upassword: ''
      },
      rules: {
        uloginName: [
          {validator: validateEmail, trigger: 'blur'},
        ],
        upassword: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {min: 3, max: 20, message: '密码长度应在8到20个字符', trigger: 'blur'}
        ]
      }
    }

    //邮箱格式验证
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请正确填写邮箱'));
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!reg.test(value)) {
            callback(new Error('请输入有效的邮箱'));
          }
        }
        callback();
      }
    };
  },
  methods: {
    login() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          request.post("/login", this.ruleForm).then(res => {
            if (res.code === '200') {
              localStorage.setItem("user", JSON.stringify(res.data)) //存储用户信息到浏览器
              let utype = res.data.utype
              if (utype === 4) {
                this.$router.push("/manager")
              } else if (utype === 3) {
                this.$router.push("/classroom-admin")
              } else if (utype === 1 || utype === 2) {
                this.$router.push("/user")
              }
              this.$notify({
                title: '登录成功',
                message: '祝您使用愉快！',
                position: 'bottom-right',
                duration: 2000,
                type: 'success'
              });
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });

    }
  }
}
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box
}

input {
  outline: none;
  border: none
}

button, input {
  overflow: visible
}

button {
  outline: none !important;
  border: none;
  background: transparent
}

a {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #666666;
  margin: 0px;
  transition: all 0.4s;
  text-decoration: none;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s
}

.text-center {
  text-align: center !important
}

.limiter {
  width: 100%;
  margin: 0 auto;
  background-image: linear-gradient(to bottom right, blue, white);
}

.container-login {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
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
  box-shadow: 0 5px 10px 0px rgb(0 0 0 / 10%);
  -moz-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 5px 10px 0px rgb(0 0 0 / 10%);
  -o-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.1)
}

.login-form {
  width: 100%
}

.login-form-title {
  display: block;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 25px;
  color: #333333;
  line-height: 1.2;
  text-align: center
}

.validate-input {
  position: relative
}

.login-input-wrap {
  width: 100%;
  position: relative;
  margin-bottom: 37px;
  border-bottom: 2px solid #adadad
}

.login-input {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  color: #555555;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: transparent;
  padding: 0 5px
}

.input-focus {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none
}

.input-focus::before {
  content: "";
  display: block;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2.5px;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
  background: #6a7dfe;
  background: -webkit-linear-gradient(left, #21d4fd, #b721ff);
  background: -o-linear-gradient(left, #21d4fd, #b721ff);
  background: -moz-linear-gradient(left, #21d4fd, #b721ff);
  background: linear-gradient(left, #21d4fd, #b721ff)
}

.input-focus::after {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  color: #999999;
  line-height: 1.2;
  content: attr(placeholder);
  display: block;
  width: 100%;
  position: absolute;
  top: 16px;
  left: 0px;
  padding-left: 5px;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s
}

.login-input:focus ~ .input-focus::before, .login-input:valid ~ .input-focus::before {
  width: 100%
}

.login-input:focus ~ .input-focus::after, .login-input:valid ~ .input-focus::after {
  top: -10px
}

.btn-show-pass {
  font-size: 15px;
  color: #999999;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  height: 100%;
  top: 4px;
  right: 0;
  padding-right: 5px;
  cursor: pointer;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s
}

.gg-eye, .gg-eye-close {
  width: 16px;
  height: 16px;
  border: solid 2px #999999;
  border-radius: 70% 20%;
  position: relative;
  transform: rotate(45deg)
}

.gg-eye::before, .gg-eye-close::before {
  content: '';
  display: block;
  position: absolute;
  width: 4px;
  height: 4px;
  border: solid 2px #999999;
  border-radius: 50%;
  left: 2px;
  top: 2px
}

.gg-eye-close::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 5px;
  width: 1.5px;
  height: 22px;
  background: #999999;
  transform: rotate(80deg)
}

.gg-eye:hover, .gg-eye-close:hover, .gg-eye-close:hover::before, .gg-eye:hover::before {
  border: solid 2px #6a7dfe
}

.gg-eye-close:hover::after {
  background: #6a7dfe
}

.container-login-form-btn {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 13px
}

.wrap-login-form-btn {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
  border-radius: 25px;
  overflow: hidden;
  margin: 0 auto
}

.login-form-bgbtn {
  position: absolute;
  z-index: -1;
  width: 300%;
  height: 100%;
  background: rgb(33, 147, 255);
  background: -webkit-linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  background: -o-linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  background: -moz-linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  background: linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff);
  top: 0;
  left: -100%;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s
}

.login-form-btn {
  cursor: pointer;
  font-family: Poppins-Medium;
  font-size: 15px;
  color: #fff;
  line-height: 1.2;
  text-transform: uppercase;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 50px
}

.wrap-login-form-btn:hover .login-form-bgbtn {
  left: 0px
}

.txt1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  color: #666666;
  line-height: 1.5
}

.txt2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  color: #333333;
  line-height: 1.5
}

.p-b-26 {
  padding-bottom: 26px
}

.p-b-48 {
  padding-bottom: 48px
}

.p-t-115 {
  padding-top: 10px
}
</style>