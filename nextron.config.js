const cwd = process.cwd();
const path = require("path");

module.exports.webpack = {
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: require.resolve("ts-loader"),
          /** @type {import("ts-loader").Options} */
          options: {
            experimentalFileCaching: true,
            configFile: path.resolve(cwd, "tsconfig.json"),
          },
        },
        exclude: [/node_modules/, path.join(cwd, "renderer")],
      },
    ],
  },
};
