import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { config } from "./webpack.config.common";
import path from "path";

const dev: Configuration & { devServer: DevServerConfiguration } = {
  ...config,
  devtool: "inline-source-map",
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3030',
        secure: false,
        ws: true,
      },
    },
    compress: false,
    hot: true,
    port: 9001,
    host: 'localhost',
    static: {
      directory: path.join(__dirname, '../public/utils'),
      publicPath: '/utils'
    },
    watchFiles: ["src/**/*"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Home",
      hash: true,
      filename: "index.html",
      chunks: ["main"],
      // template: `./${baseDirectory}/assets/html/index.html`,
      template: path.join(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "style.css",
    }),
  ],
};

export default dev;
