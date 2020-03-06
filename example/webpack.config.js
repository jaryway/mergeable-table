process.env.BABEL_ENV = "production";
// process.env.NODE_ENV = 'production';

const fs = require("fs");
const path = require("path");

module.exports = {
  mode: process.env.BABEL_ENV,
  entry: "./example/index.js",
  output: {
    filename: "main.js"
  },
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: "./example/public",
    port: 4000,
    open: true,
    // quiet: true,
    hot: true
  },
  resolve: { modules: ["node_modules"] },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "less-loader",
            options: {
              strictMath: true,
              noIeCompat: true,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.css/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  performance: false
};
