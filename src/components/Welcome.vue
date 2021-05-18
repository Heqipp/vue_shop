<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="欢迎查看~"
            type="success">
          </el-alert>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-tree :data="my"  @node-click="handleNodeClick" default-expand-all></el-tree>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      my:[
        { label: '项目名称',
          children: [{ label: '电商后台管理系统'}]
        },
        { label: '项目技术栈',
          children: [{ label: 'Vue、Element、js、css、html'}]
        },
        { label: '项目周期',
          children: [{ label: '15天'}]
        },
        { label: '项目负责者',
          children: [{ label: 'HE'}]
        },
      ]
    }
  },
  methods: {
    handleNodeClick (data) {
      //console.log(data)
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

</style>
