import path from 'path';
import * as webpack from 'webpack';
import * as dotenv from 'dotenv';

// This file is used to configure Webpack for the Padicare project.
// The configuration is a function that takes the current Webpack configuration as an argument and returns a new configuration object.
// The configuration uses the dotenv-webpack plugin to load environment variables from a .env file.
// "builder": @angular-devkit/build-angular:application to "builder": @angular-devkit/build-angular:browser


module.exports = (config: webpack.Configuration) => {
  const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};
  const envKeys = Object.keys(env).reduce((prev: { [key: string]: string }, next: string) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.DefinePlugin(envKeys));
  config.resolve = {
    ...config.resolve,
    fallback: {
      "crypto": false,
    }
  };
  return config;
};

