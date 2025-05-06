'use strict'
const path = require('path')
const webpack = require('webpack')

const AR_APP_CONFIG = require('./public/config')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '智能决策平台' // page title
// 打包压缩静态文件插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

const env = process.env.NODE_ENV === 'development'

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  parallel: false,
  // publicPath: process.env.NODE_ENV === 'production' ? '/dist/' : './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: env,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8901', //真实接口
    //     changeOrigin: true, // 允许跨域
    //     pathRewrite: {
    //       // 如果接口中是没有api的，那就直接置空，'^/api': ''，
    //       // 如果接口中有api，那就得写成{'^/api':'/api'}
    //       '^/api': ''
    //     }
    //   }
    // },
    before: require('./mock/mock-server.js')
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: env ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
      alias: {
        '@': resolve('src'),
        '@public': resolve('public')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'AR_APP_CONFIG': JSON.stringify(AR_APP_CONFIG)
      })
    ]
  },
  chainWebpack(config) {
    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }
    if (process.env.NODE_ENV === 'production') {
      config.plugin('CompressionWebpackPlugin').use(new CompressionWebpackPlugin({
        test: /\.(js)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: false // 删除源文件
      }))
    }

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    // config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                // commons: {
                //   name: 'chunk-commons',
                //   test: resolve('src/components'), // can customize your rules
                //   minChunks: 3, //  minimum common number
                //   priority: 5,
                //   reuseExistingChunk: true
                // }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
