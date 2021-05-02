<template>
  <div class="login_container">
    <div class="login_box">
      <!--        登录头像-->
      <div class="avatar_box">
        <img src="../assets/img/webp.webp" alt="">
      </div>
      <!--        登录区域-->
      <el-form class="login_form"
               :model="loginForm"
               :rules="loginFormRules"
               ref="loginFormRef"
      >
        <!--          输入框-->
        <el-form-item prop="username">
          <el-input class="login_input" v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-yonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password">
            <i slot="prefix" class="iconfont icon-password"></i>
          </el-input>
        </el-form-item>
        <!--          登录按钮-->
        <el-form-item class="btns">
          <el-button type="info" @click="resetLoginForm">重置</el-button>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      //这是登陆数据表单的绑定对象:如果数据填入值，就是默认值
      loginForm: {
        username: '',
        password: ''
      },
      //表单验证规则
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    //登录验证事件
    login () {
      //1.预验证：.validate是element的内置函数
      this.$refs.loginFormRef.validate( async (valid) => {
        //2.根据预验证的结果：valid的布尔值判断是否进行下一步的数据提交
        if(!valid) return
        //es6的对象的解构赋值： const { data:res }={data：‘xxx’}
        //3.axios进行提交
        const { data:res }= await this.$http.post('login',this.loginForm)
        //console.log(result)
        //4.根据返回的状态码来判断验证成功与否
        if(res.meta.status !==200) return this.$message.error('登录失败')//.$message.error是Element里的提示弹框函数
        this.$message.success('登陆成功')
        //账号admin密码123456
        console.log(res)
        //5.储存token值
        window.sessionStorage.setItem("token",res.data.token)
        //6.登录并储存完毕后跳转到后台页面
        this.$router.push('/home')
      })
    },
    //重置表单：点击
    resetLoginForm () {
      //console.log(this)查看this里的ref，知道从哪里拿取组件
      //获取组件loginFormRef，并执行Element内置的重置函数resetFields()
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>

.login_container {
  background-color: #2d4d6b;
  height: 100%;
}

.login_box {

  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_input {
  /*margin-bottom: 20px;*/
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

i {
  margin-left: 6px;
}
</style>
