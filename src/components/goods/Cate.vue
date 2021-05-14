<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!--添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--  树状表格-->
      <!--属性讲解：
          data：绑定要展示的数据源合集
          columns：定义表格内容：列名、数据绑定
          selection-type：隐藏多选按钮：取消多选功能
          expand-type：隐藏展开按钮：取消展开功能
          show-index ：展示索引号123456...
          border：显示纵向表格线
          show-row-hover：鼠标悬停时高亮当前行
      -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <!--是否有效按钮-->
        <template slot="isok" slot-scope="scope">
          <!--根据数据里的cat_deleted来判断按钮显示样式-->
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: #ff0000;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <!--通过数据值判断性显示-->
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  <!--  添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClosed"
      width="50%">
     <!--内容区域-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      <!--父级分类  -->
        <el-form-item label="父级分类：">
          <!--¶Cascader 级联选择器:
            options 用来指定数据源
             props 用来指定配置对象
             v-model绑定的是被选择的选项id数组
             clearable 支持取消选择
              change-on-select：级联选择器默认只能选择最底层的选项，无法选择第一层标题选项。
          -->
          <el-cascader
            :options="parentCateList"
            :props=" cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!--  按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click=" addCate">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 父级分类的列表
      parentCateList: [],
      //添加分类的表单
      addCateForm:{
        //将要添加的分类名称
        cat_name:'',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类的预验证规则
      addCateFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //添加分类对话框显示开关
      addCateDialogVisible:false,
      // 查询条件:提交参数+分页需要的属性
      queryInfo: {
        type: 3,//三层数据全部获取
        pagenum: 1,//当前页码值
        pagesize: 5//每页显示多少条数据
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      //定义的是树状表格的列内容
      columns: [
        //第一列：分类名称
        {
          label: '分类名称',//列标题
          prop: 'cat_name' //绑定的数据
        },
        //第二列：是否有效按钮：需要用到数据布尔值来控制按钮样式显示
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template', //使用template虚空组件，使用作用域插槽的前提
          // 表示当前这一列使用模板名称
          template: 'isok'  //具名插槽名字
        },
        //第三列：排序
        {
          label: '排序', //列名
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', //指向数据源特定值
        label: 'cat_name', //这个数据源显示的部分
        children: 'children'//根据什么确定父子关系
      },
      // 添加分类里选中的父级分类的Id数组
      selectedKeys: []
    }
  },
  created () {
    //获取商品列表数据
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo//传入三个参数
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // 储存数据
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    //监听分页显示数量属性的改变事件：重新渲染页面
    handleSizeChange(newSize) { //newPage为点击后对应的值
      //新值赋值给原属性
      this.queryInfo.pagesize = newSize
      //重新渲染
      this.getCateList()
    },
    //监听分页当前页属性的改变事件：重新渲染页面
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //添加分类点击事件
    showAddCateDialog(){
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      //console.log(res.data)
      //数据储存
      this.parentCateList = res.data
    },
    // 添加分类对话框：选择项发生变化触发这个函数
    parentCateChanged() {
      //console.log(this.selectedKeys)  点击分类选项后输出这个被选择的ID数组
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      //为空数组赋值的目的是在于后一步的提交到后台需要这些参数
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id：将数组中最后一项的值赋值给cat_pid
        this.addCateForm.cat_pid = this.selectedKeys[
        this.selectedKeys.length - 1
          ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {  //当没选择父级分类时，将数据赋值为0=一级等级
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      //预验证完毕后根据返回值判断是否提交到后台
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        //提交到后台：需要参数信息参数
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      //清除父级选项框里的内容
      this.selectedKeys = []
      //清除赋值
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
.el-row{
  margin-bottom: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
