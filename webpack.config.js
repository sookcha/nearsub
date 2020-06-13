const path = require('path');
const slsw = require("serverless-webpack");

module.exports = {
  entry: "./src/app.ts",
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  output: {
      libraryTarget: "commonjs2",
      path: path.join(__dirname, './dist'),
      filename: "./app.js",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
      rules: [
          // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
          { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
      ],
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  target: 'node',
};