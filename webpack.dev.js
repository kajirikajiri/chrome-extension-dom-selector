// eslint-disable @typescript-eslint/no-var-requires
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack")
const dotenv = require('dotenv')
const path = require('path')

const env = dotenv.config({path: path.resolve(process.cwd(), '.env.dev')}).parsed

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
  ],
});
