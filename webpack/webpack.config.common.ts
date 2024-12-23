import { Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

export const baseDirectory = "src";

export const config: Configuration = {
  mode: "development",
  entry: {
    main: [`./${baseDirectory}/front/index.ts`],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].bundle.js",
    publicPath: "/", // change to your github repo project name
  },
  target: "web",
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      { test: /src\/back/, loader: 'ignore-loader' },
      { test: /\.tsx?$/, use: "ts-loader" },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default config;
