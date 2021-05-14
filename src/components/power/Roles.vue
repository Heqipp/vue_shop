<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容盒子-->
    <el-card class="box-card">
      <el-button type="primary" class="addrole">添加角色</el-button>
      <!-- 卡片内容盒子-->
      <el-card class="box-card">
        <!--列表-->
        <el-table :data="rolesList" border stripe>
          <!--分类标题+填入数据-->
          <!--权限下拉展开-->
          <el-table-column type="expand">
            <!--作用域插槽调用数据-->
            <template slot-scope="scope">
              <!--渲染一级权限-->
              <el-row :class="['bdbottom',i1===0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                <el-col :span="5">
                    <el-tag>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right" ></i>
                </el-col>
              <!--  渲染二级权限和三级权限-->
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <!-- 通过 for 循环 嵌套渲染二级权限 -->
                  <!--使用element的行row和列col布局模式：span控制间距-->
                  <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <!--给标签添加移除事件:-->
                      <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!--三级标题：嵌套在二级标题里-->
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <pre>{{scope.row}}</pre>>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
              <el-button icon="el-icon-delete" size="mini" type="danger">删除</el-button>
              <el-button icon="el-icon-setting" size="mini" type="warning" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      >
      <!--内容区域-->
      <!--树形结构组件-->
      <el-tree :data="rightslist"
               :props="treeProps"
               show-checkbox
               default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"
               node-key="id"></el-tree>
      <!--按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary"  @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      //所有角色列表的数据
      rolesList: [],
      //分配权限对话框：布尔开关
      setRightDialogVisible:false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象:规定的是父子级根据什么属性进行确定父子级关系
      treeProps: {
        label: 'authName',  //父级对应的数据属性名
        children: 'children'  //子级对应的数据属性名
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
    }

  },
  created () {
    // 获取所有的角色列表数据
    this.getRolesList()
  },
  methods: {
    //获取所有角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      //储存
      this.rolesList = res.data
      //console.log(this.rolesList)
    },
      // 根据Id删除对应的权限：传入的实参是全部表单数据role=scope.row，对应权限的id=item2.id
      async removeRightById(role,rightId) {
        // 弹框提示用户是否要删除
        const confirmResult = await this.$confirm(
          '此操作将永久删除该权限, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除！')
        }
        //点击确定时：axios向后台进行删除操作
        //需要携带两个动态参数：角色id和权限的id
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )

        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败！')
        }
        //后台删除成功时：
        this.$message.success('删除权限成功')
        //不使用重新请求函数getRolesList的原因是：会造成页面重新渲染导致下拉表单收缩
        // this.getRolesList()
        //解决办法：直接使用重新赋值
        role.children = res.data
      },
    //分配权限事件：点击显示对话框
    async showSetRightDialog(role){
      //储存角色的id,方便分配权限的提交事件获取到此角色id
      this.roleId = role.id
      //获取所有权限：树结构
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      //console.log(this.rightslist)
      //递归的理解:就是不断调用自身，知道找到符合条件，才终止调用
      // 递归获取三级节点的Id:传入实参：所有表单数据role和默认选中的节点Id值数组defKeys
      this.getLeafKeys(role, this.defKeys)
      //显示对话框
      this.setRightDialogVisible=true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件:清除上一个默认权限
    setRightDialogClosed() {
      //储存默认权限的数组：清空
      this.defKeys = []
    },
    //分配权限的确定按钮：获取所选的树节点id，并提交到后台
    async allotRights(){
      const keys=[
        //ES6语法：利用展开运算合并数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      //console.log(keys)//输出的是此时所选树节点的id
      //使用join拼接数组，用','隔开
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      //console.log(res)
      if(res.meta.status!==200) return this.$message.error('分配权限出错')
      this.$message.success('分配权限成功')
      //渲染新数据画面：
      this.getRolesList()
      //关闭对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.addrole {
  margin-bottom: 15px;
}
.el-tag{
  margin:7px
}
.bdtop{
  border-top:1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
