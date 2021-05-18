//1.完成自定义入口文件的设置：两个模式下的入口文件
//2.配置CDN优化文件
module.exports = {
  chainWebpack: config => {
    //发布模式的入口文件
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      //配置CDN
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })


      //index.html的标题
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })


    })
    //开发模式的入口文件
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')


      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },

  lintOnSave: false
}
