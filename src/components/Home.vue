<template>
  <el-container class="homecontainer">
    <!--    头部区域-->
    <el-header>
      <div>
        <img src="../assets/img/heima.png" alt=""/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--    除头部的内容主体-->
    <el-container>
      <!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' :'200px' ">
        <!--侧边栏的折叠按钮-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--菜单div盒子-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >

          <!--        一级标题-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!--              icon-->
              <i :class="iconObj[item.id]"></i>
              <!--              标题文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--            二级标题-->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/'+subitem.path)"
            >
              <!--              icon-->
              <i class="el-icon-menu"></i>
              <!--              标题文本-->
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!--      右侧内容主体-->
      <el-main>
          <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      //左侧菜单栏数据
      menulist: [],
      //一级标题的icon
      iconObj: {
        '125': 'iconfont icon-yonghuguanli',
        '103': 'iconfont icon-quanxianguanli',
        '101': 'iconfont icon-shangpinguanli',
        '102': 'iconfont icon-dingdanguanli',
        '145': 'iconfont icon-shujutongji'
      },
      //控制侧边栏的折叠：开关
      isCollapse: false,
      //激活状态的index
      activePath:''
    }
  },
  //生命周期函数，渲染页面前执行数据请求函数
  created () {
    //调用请求左侧数据栏数据的方法
    this.getMenuList()
    //将储存的index值取出并赋值给default-active：这样就能实现刷新页面后仍然高亮原先标题
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {//方法
    //点击退出--登录页面
    logout () {
      //1.清除页面的token值（因为路由导航的存在，你没有token值就无法访问其他页面，必须先跳转到登录页面）
      window.sessionStorage.clear()
      //2.跳转到登录页面
      this.$router.push('./login')
    },
    //请求左侧栏数据
    async getMenuList () {
      //数据储存到res变量
      const { data: res } = await this.$http.get('menus')
      //如果请求失败则返回:请求数据中的告知请求结果的说明文字msg
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //如果请求成功则储存数据
      this.menulist = res.data
      console.log(res)
    },
    //侧边栏的折叠点击事件
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    //保存标题的index值到浏览器：维持标题的高亮状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath=activePath
    }
  }
}
</script>

<style scoped>
.homecontainer {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  /*头部内容贴边缘对齐*/
  justify-content: space-between;
  padding-left: 5px;
  /*按钮上下不贴边对齐，居中*/
  align-items: center;
  color: #fff;
  font-size: 20px;
}

/*设置logo和文字的对齐方式*/
.el-header div {
  display: flex;
  align-items: center;
}

.el-header div span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.el-submenu span {
  padding-left: 10px;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 15px;
  height: 30px;
  color: white;
  text-align: center;
  line-height: 30px;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
