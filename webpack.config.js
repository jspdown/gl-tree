const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './viewer/viewer.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'index.js'
  },
  module: {
    rules: [{
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: [
        'raw-loader',
        'glslify-loader'
      ]
    }, {
      test: /\.js$/,
      loader: 'ify-loader',
      enforce: 'post'
    }]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
          {from: 'index.html', to: 'index.html'},
          {from: 'style/style.css', to: 'style.css'},
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 8080,
    open: true
  }
};