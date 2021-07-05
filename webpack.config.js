const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === "dev";
const isProd = ENV === "build";

function setDevTool() {
  if (isDev) {
    return "cheap-module-eval-source-map";
  } else {
    return "none";
  }
}

function setDMode() {
  if (isProd) {
    return "production";
  } else {
    return "development";
  }
}

const config = {
  target: "web",
  entry: { index: "./src/js/index.js" },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  mode: setDMode(),
  devtool: setDevTool(),
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: "./postcss.config.js" },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: "./postcss.config.js" },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "img",
              name: "[name].[ext]",
            },
          },
        ],
      },

      {test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {loader: "file-loader",
            options: {
              outputPath: "fonts",
            },
          },
        ],
      },

      {test: /\.(mp3)$/i,
        use: [
          {loader: "file-loader",
            options: {
              outputPath: "audio", 
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebPackPlugin({
      favicon: "./src/img/rotate.svg",
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new CopyWebpackPlugin([
      { from: "./src/img", to: "./img/" },
      { from: "./src/audio", to: "./audio/" },
    ]),
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    overlay: true,
    stats: "errors-only",
    clientLogLevel: "none",
  },
};

if (isProd) {
  config.plugins.push(new UglifyJSPlugin());
}

module.exports = config;
