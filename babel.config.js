// Babel 配置文件
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    // 只有在项目使用React时才需要下面这行
    // '@babel/preset-react'
  ],
  plugins: [
    // 处理Vite特有的import.meta.env语法
    'babel-plugin-transform-vite-meta-env'
  ]
};