module.exports = {
  resolve: {
    modulesDirectories: ['node_modules']
  },
  entry: './client/src/app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.html$/, loaders: ['html'] },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },
  devtool: 'source-map'
};
