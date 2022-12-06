const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.MIRAGE_ENABLED !== "true"
    ) {
      config.module
        .rule("exclude-mirage")
        .test(/node_modules\/miragejs\//)
        .use("null-loader")
        .loader("null-loader");
    }
  },
});
