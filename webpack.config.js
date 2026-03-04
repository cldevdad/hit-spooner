const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReloadExtensionWebpackPlugin = require("./reloadExtensionWebpackPlugin");

module.exports = {
  entry: {
    content: "./src/index.tsx",
    background: "./src/background.ts",
    popup: "./src/popup/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      // Add your alias here
      "@hit-spooner/api": path.resolve(__dirname, "src/api"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/manifest.json", to: "." },
        { from: "public/icons", to: "icons" },
        { from: "public/index.html", to: "." },
        { from: "public/popup.html", to: "." },
        { from: "public/postcss.config.cjs", to: "." },
      ],
    }),
    new ReloadExtensionWebpackPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
