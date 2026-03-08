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
    chunkFilename: "[name].[contenthash:8].js",
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
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
          reuseExistingChunk: true,
        },
        // React and related libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|@emotion)[\\/]/,
          name: "react-vendors",
          priority: 20,
          reuseExistingChunk: true,
        },
        // Mantine UI library
        mantine: {
          test: /[\\/]node_modules[\\/]@mantine[\\/]/,
          name: "mantine-vendors",
          priority: 15,
          reuseExistingChunk: true,
        },
        // Common code shared between chunks
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: "common",
        },
      },
    },
    runtimeChunk: "single",
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
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
