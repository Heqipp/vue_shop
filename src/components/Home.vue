<template>
<div class="home">
   <el-button type="info" @click="logout">退出</el-button>
</div>
</template>

<script>
export default {
name: "Home",
  methods:{//方法
  //点击退出--登录页面
    logout(){
      //1.清除页面的token值（因为路由导航的存在，你没有token值就无法访问其他页面，必须先跳转到登录页面）
      window.sessionStorage.clear();
      //2.跳转到登录页面
      this.$router.push('./login')
    }
  }
}
</script>

<style scoped>

</style>
