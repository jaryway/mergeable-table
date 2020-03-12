process.env.BABEL_ENV = "development";
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
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.less$/,
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
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
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            use: [{ loader: "style-loader" }, { loader: "css-loader" }]
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
              ],
              plugins: [
                [
                  "@babel/plugin-transform-typescript",
                  { allowNamespaces: true }
                ]
              ]
            }
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react",
                  "@babel/preset-typescript"
                ],
                cacheDirectory: true
              }
            }
          }
          // {
          //   test: /\.(js|mjs)$/,
          //   exclude: /@babel(?:\/|\\{1,2})runtime/,
          //   loader: require.resolve("babel-loader"),
          //   options: {
          //     babelrc: false,
          //     configFile: false,
          //     compact: false,
          //     // presets: [
          //     //   [require.resolve('babel-preset-react-app/dependencies'), { helpers: true }],
          //     // ],
          //     cacheDirectory: true,
          //     // See #6846 for context on why cacheCompression is disabled
          //     cacheCompression: false,

          //     // If an error happens in a package, it's possible to be
          //     // because it was compiled. Thus, we don't want the browser
          //     // debugger to show the original code. Instead, the code
          //     // being evaluated would be much more helpful.
          //     sourceMaps: false
          //   }
          // }
        ]
      }
    ]
  },
  performance: false
};
