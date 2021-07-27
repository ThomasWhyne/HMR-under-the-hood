const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './src/index.jsx'),
  output: {
    path: path.join(__dirname, './build'),
    publicPath: '/build/',
  },
  devServer: {
    port: 3333,
    hot: true,
    inline: true,
    open: true,
    openPage: `http://127.0.0.1:3333/build`,
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
