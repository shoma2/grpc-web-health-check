const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const commonConfig = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules(?!\/grpc-web-health-check)/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "Gwhc",
    globalObject: "typeof self !== 'undefined' ? self : this",
    umdNamedDefine: true
  }
};

const clientConfig = {
  ...commonConfig,
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": true
    })
  ]
};

const serverConfig = {
  ...commonConfig,
  target: "node",
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": false
    })
  ],
  output: {
    ...commonConfig.output,
    filename: "bundle.node.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules")
    })
  ]
};

module.exports = [serverConfig, clientConfig];
