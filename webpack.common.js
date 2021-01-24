// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  entry: {
    mainMenu: path.join(__dirname, "src/popup/MainMenu/index.tsx"),
    endButton: path.join(__dirname, "src/popup/EndButton/index.tsx"),
    eventList: path.join(__dirname, "src/popup/EventList/index.tsx"),
    eventPlayer: path.join(__dirname, "src/popup/EventPlayer/index.tsx"),
    background: path.join(
      __dirname,
      "src/background/index.ts"
    ),
    content_scripts: path.join(
      __dirname,
      "src/content/index.ts"
    ),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader", // Creates style nodes from JS strings
          },
          {
            loader: "css-loader", // Translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // Compiles Sass to CSS
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
