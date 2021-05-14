<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容盒子-->
    <el-card class="box-card">
      <!--  搜索与添加区域:间隔布局:gutter控制间距、span控制元素宽度 -->
      <el-row :gutter="50">
        <el-col :span="10">
          <!--搜索框的开发：双向绑定-->
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--添加用户按钮-->
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--  用户列表展示-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!--状态按钮的制作-->
        <el-table-column label="状态" prop="mg_state" width="150">
          <!--作用域插槽+templat不会渲染的节点元素-->
          <template slot-scope="scope">
            <!--显示作用域的数据，用于查看{{scope.row}}-->
            <!--按钮：双向绑定了数据的布尔值mg_state-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="300">
          <!--作用域插槽+templat不会渲染的节点元素-->
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini" type="primary">编辑</el-button>
            <!--删除按钮-->
            <el-button @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini" type="danger" >删除</el-button>
          <!--  分配权限-->
            <el-button icon="el-icon-setting" size="mini" type="warning" @click="showSetRolesDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!--内容区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!--用户名的输入框-->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!--密码的输入框-->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <!--邮箱的输入框-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!--手机号码的输入框-->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <!--按钮区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容区域-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <!--用户名输入框-->
        <el-form-item label="用户名">
          <!--禁用输入框disabled-->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!--邮箱输入框-->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!--手机号码输入框-->
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
    </el-dialog>
  <!--  分配角色对话框-->
    <el-dialog
      title="提示"
      :visible.sync="setRolesDialogVisible"
      width="30%"
      @close="setRoleDialogClosed"
    >
      <!--内容区域-->
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色:
          <!--单选框组件-->
          <!--v-model="selectedRoleId":这个是选择一个角色类型后就赋值这个角色id到一个空对象，之后用来提交到后台-->
          <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select></p>

      </div>
      <!--按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    //自定义验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //正则表达式：规则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]))+/
      //判断：如果输入的值符合规则，那么返回回调函数callback
      //使用test测试value值是否符合regEmail规定的规则
      if (regEmail.test(value)) {
        return cb()
      }
      //判断：如果不符合规则，那么弹出提示消息：请输入正确的邮箱格式
      cb(new Error('请输入合法的邮箱'))
    }
    //自定义验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //规则：从头开始第一位是1第二位是3,4,5,7,8第三位到结尾是0 - 9 的数字
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 已选中的角色Id值
      selectedRoleId: '',
      //用户列表储存
      rolesList:[],
      //角色数据
      userInfo:{},
      //分配角色对话框开关：
      setRolesDialogVisible:false,
      //获取用户列表数据：需要提交的参数
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前页内显示的数据数量
        pagesize: 2
      },
      //获取用户列表数据：储存返回的数据
      userlist: [],
      //页码数量
      total: 0,
      //控制对话框的隐藏和显示
      addDialogVisible: false,
      //添加用户的表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户的表单预验证规则
      addFormRules: {
        //验证用户名
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        //验证密码
        password: [
          {
            required: true,
            message: '请输入用户密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        //验证邮箱
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        //验证手机号
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      //修改用户对话框的控制开关
      editDialogVisible: false,
      //修改用户的对话框数据表单储存
      editForm: {
        username: '',
        mobile: '',
        email: ''
      },
      //修改用户的规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],

      }
    }
  },
  created () {
    //请求用户列表数据
    this.getUserList()
  },
  methods: {
    //请求用户列表数据:需要提交三个参数
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      //储存数据到data
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    //提示：后台的总数据条数只有4条
    //当前页显示的数据条数量事件
    handleSizeChange (newSize) {
      //1.newSize是当前显示数据的数量，将其赋值给请求数据时要上传的参数pagesize
      this.queryInfo.pagesize = newSize
      //2.当显示数据条的数量改变了，我们需要重新请求数据来显示正确的数据条数量
      this.getUserList()
      //console.log(newSize);
    },
    //切换页码时触发的事件
    handleCurrentChange (newPage) {
      //1.改变后的页码赋值给储存参数
      this.queryInfo.pagenum = newPage
      //2.将实参上传服务器重新请求正确数据：动态改变页面数据展示
      this.getUserList()
      //console.log(newPage);
    },
    //监听switch开关的状态改变：状态按钮改变时将其上传服务器，改变服务器端的值
    async userStateChanged (userinfo) {
      console.log(userinfo)
      //api文档中会有这样的请求路径：users/:uId/state/:type.带冒号的不能直接提交，应该用具体的参数值 ${xxx} 来取代，并且此路径应用模板字符串` `来包围
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      //数据更新失败服务器会返回status值，失败后让其布尔值取反，依然实现本地的布尔值的改变，之后弹出消息框：更新失败
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      //提交更新成功时，弹出消息框
      this.$message.success('更新用户状态成功')
    },
    //监听对话框的关闭事件：重置输入框
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    //预验证后的提交判断
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        //预验证失败则返回
        if (!valid) return this.$message.error('格式错误')
        //预验证成功则提交数据到后台
        const { data: res } = await this.$http.post('users', this.addForm)
        //根据后台返回数据进行判断
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        //关闭对话框
        this.addDialogVisible = false
        //重新请求数据展示到用户列表
        this.getUserList()
      })
    },
    //展示编辑用户的对话框
    async showEditDialog (id) {
      //console.log(id)
      //请求对应id的用户数据：先获取到用户数据才能进行修改
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      //储存查询到的用户数据
      this.editForm = res.data
      //显示对话框：布尔开关
      this.editDialogVisible = true
    },
    //编辑用户的对话框的重置数据事件：
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    //预验证完毕后，提交修改用户的信息到后台
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        //console.log(valid)
        //预验证失败时
        if (!valid) return
        //预验证成功：将数据提交:因为双向绑定，所以修改的数据在editForm中已经改变了
        const { data: res } = await this.$http.put('users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
        //判断是否上次成功
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    //删除按钮的弹框事件：根据id删除对应用户
    async removeUserById (id) {
      //console.log(id)
      //弹框询问：$confirm返回的值是个promise
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)//catch捕获点击取消时的结果
      //点击确定/取消，返回的值不一样
      // 如果用户确认删除，则返回值为字符串 confirm，如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)  //输出返回值
      //判断返回值：取消删除的情况
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      //点击确定后，真正的提交删除请求到后台
      const{data:res}=await this.$http.delete('users/'+id)
      if(res.meta.status!==200){
        return  this.$message.error('删除用户')
      }
      //删除信息确定后弹出消息
      this.$message.success('删除用户成功！')
      //重新渲染数据
      this.getUserList()
    },
    //分配角色对话框显示:接受实参：用户角色全部数据scope.row=userInfo
    async showSetRolesDialog(userInfo){
      this.userInfo=userInfo
      //在显示对话框前，先请求所有用户列表数据
      const {data:res}=await this.$http.get('roles')
      console.log(res)
      if(res.meta.status!==200) return this.$message.error('分配角色失败')
      //储存数据
      this.rolesList=res.data
      //显示对话框
      this.setRolesDialogVisible=true
    },
    //点击确定按钮：提交分配角色数据到后台
    async saveRoleInfo(){
      //未选择分配的角色类别时，提醒
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      //提交选择的角色id到后台
      //rid：角色id
      const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      console.log(res)
      if(res.meta.status!==200) return this.$message.error('分配角色失败（admin用户不允许被修改）')
      this.$message.success('分配角色成功')
      //渲染新数据
      this.getUserList()
      this.setRolesDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件:清空值
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
