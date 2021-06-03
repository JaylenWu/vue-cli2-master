module.exports = {
    publicPath: "/", // 默认"/"
    outputDir: "dist", // 默认dist
    assetsDir: "", // 默认"" (相对于outputDir)
    filenameHashing: true, // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
    lintOnSave: 'default', // Type: boolean | 'warning' | 'default' | 'error'
    runtimeCompiler: "false", // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
    productionSourceMap: true, // source map， 设为false可以加快构建速度
    devServer: {
        proxy: {
            '/ht': {
                target: 'https://api-stg.jushipinlei.com/daishu-api',
                // ws: true,
                changeOrigin: true,
                // pathRewrite:{
                //     '^/ht':''
                // }
            },
        }, // 是一个指向开发环境 API 服务器的字符串
    }
}