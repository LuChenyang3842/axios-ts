const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
  /**  在example 目录下建多个子目录
   * 不同章节的demo放到不同子目录
   * 每个子目录下会创建一个app.ts
   * app.ts是webpack构建文件的入口文件
   * entries收集了多目录个入口文件，每个入口引入用于热更新的文件
   * entries是一个对象，key为目录名
   **/

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.ts')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }

    return entries
  }, {}),

  /**
   * 根据不同的目录名称，打包生成目标 js，名称和目录名一致
   */
  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [{
        test: /\.ts$/,
        enforce: 'pre',
        use: [{
          loader: 'tslint-loader'
        }]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
