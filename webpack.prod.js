// eslint-disable @typescript-eslint/no-var-requires
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack")
const dotenv = require('dotenv')
const path = require('path')

const env = dotenv.config({path: path.resolve(process.cwd(), '.env.prod')}).parsed

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
  ],
});
