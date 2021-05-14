<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容盒子-->
    <el-card class="box-card">
      <!--列表-->
      <el-table :data="rightsList" border stripe>
        <!--分类标题+填入数据-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!--作用域插槽：父传子数据-->
          <template slot-scope="scope">
            <!--根据数据返回值里的level值来判断性的显示-->
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data(){
    return{
      rightsList:[]
    }
  },
  created () {
    // 获取所有的权限列表数据
    this.getRightsList()
  },
  methods:{
    //获取所有权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
        //储存
      this.rightsList = res.data
      //console.log(this.rightsList)
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
</style>
