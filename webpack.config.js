const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';

const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.ts'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
    ],
  },
  optimization: {
    minimize: isProd,
  },
  devtool: isDev ? 'source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
};
