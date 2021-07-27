const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, './build'),
    publicPath: '/build/',
  },
  devServer: {
    port: 8808,
    hot: true,
    inline: true,
    open: true,
    openPage: `http://127.0.0.1:8808/build`,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      $src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
