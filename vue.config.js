const path = require("path");
const env = process.env.NODE_ENV || "development";
function resolve(dir) {
  return path.join(__dirname, dir);
}

const pages = {
  index: {
    template: 'public/index.html',
    entry: "src/main.js",
    filename: "index.html",
    chunks: [
      "chunk-libs",
      "index",
      "manifest.index",
    ],
  },
  more: {
    template: 'public/index.html',
    entry: "src/main.js",
    filename: "more.html",
    chunks: [
      "chunk-libs",
      "more",
      "manifest.more"
    ]
  }
};
module.exports = {
  pages: pages,
  chainWebpack(config) {
    config.when(env !== "development", (config) => {
      // 将经常变的runtime.js文件内容放到html中，提高请求性能
      Object.keys(pages).forEach((page) => {
        // config
        //   .plugin("ScriptExtHtmlWebpackPlugin")
        //   .after(`html-${page}`)
        //   .use("script-ext-html-webpack-plugin", [
        //     {
        //       inline: /runtime\..*\.js$/,
        //     },
        //   ])
        //   .end();

        // 当有很多页面时，会导致太多无意义的请求
        config.plugins.delete(`prefetch-${page}`);
        config.plugins.delete(`preload-${page}`);
      });
      // // js文件拆包
      // 为每个入口创建一个对应的manifest清单
      config.optimization.runtimeChunk({
        name: (entryPoint) => `manifest.${entryPoint.name}`,
      });
      config.optimization.splitChunks({
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 200000,
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
    });
  }
};