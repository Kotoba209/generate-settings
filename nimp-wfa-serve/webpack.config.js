const path = require("path");

module.exports = {
  mode: "production", //development、production   这里是说webpack打包的结果是哪种，选production会进行极致压缩获得低存储大小同时使代码失去可读性
  entry: path.resolve(__dirname, "./src/index.js"), //入口文件
  output: {
    path: path.resolve(__dirname, "./build"), //出口路径
    filename: "app.js", //出口文件名
  },
  mode: "develop",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  externals: {
    ws: "commonjs ws",
  },
};
