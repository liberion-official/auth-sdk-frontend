const path = require("path");
const webpack = require("webpack");

module.exports = () => {
  return {
    mode: "production",
    entry: path.join(__dirname, "src/index-pkg.js"),
    output: {
      path: path.resolve(__dirname, "lib"),
      filename: "index.js",
      globalObject: "this",
      library: "LiberionIdWidget",
      libraryTarget: "umd",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
    },
    module: {
      rules: [
        // JS,JSX
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          exclude: /node_modules/,
        },
        // SVG
        {
          test: /\.svg$/i,
          use: ["@svgr/webpack"],
        },
      ],
    },

    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "React",
        root: "React",
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "ReactDOM",
        root: "ReactDOM",
      },
    },

    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
