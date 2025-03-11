const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, "tsconfig.json"), []);

module.exports = {
  output: {
    uniqueName: "angularHost",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "angularHost",
      filename: "remoteEntry.js",
      remotes: {
        reactDashboard: "reactDashboard@http://localhost:3000/remoteEntry.js",
      },
      shared: {
        ...share({
          "@angular/core": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "auto",
          },
          "@angular/common": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "auto",
          },
          "@angular/common/http": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "auto",
          },
          "@angular/router": {
            singleton: true,
            strictVersion: true,
            requiredVersion: "auto",
          },
          react: { singleton: true, requiredVersion: "^18.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
        }),
        ...sharedMappings.getDescriptors(),
      },
    }),
    sharedMappings.getPlugin(),
  ],
};
