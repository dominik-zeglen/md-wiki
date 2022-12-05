const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

const config = {
  entry: ["./src/index.tsx"],
  module: {
    rules: [
      {
        test: /.*\.tsx$/,
        loader: "string-replace-loader",
        options: {
          search: /import_meta\.url/,
          replace: "import.meta.url",
        },
      },
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2018",
        },
      },
      {
        test: /\.js?$/,
        loader: "esbuild-loader",
        resolve: {
          fullySpecified: false,
        },
        options: {
          target: "es2018",
        },
      },
      {
        test: /\.scss$/i,
        use: [
          "style-loader",
          {
            loader: "dts-css-modules-loader",
            options: {
              namedExport: true,
              banner:
                "/* @generated */\n/* prettier-ignore */\n/* eslint-disable */",
            },
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(svg|png|jpe?g)$/,
        type: "asset/resource",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    }),
    new ForkTsCheckerWebpackPlugin(),
    new EnvironmentPlugin([
      "REACT_APP_REGION",
      "REACT_APP_API_URL",
      "REACT_APP_USER_POOL_ID",
      "REACT_APP_USER_POOL_CLIENT_ID",
      "REACT_APP_IDENTITY_POOL_ID",
    ]),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    open: true,
    port: 10000,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
      }),
    ],
  },
  devtool: "source-map",
};

module.exports = config;
