const path = require('path');

module.exports = {
  entry:  {
    'main.js': '/src/index.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'modules')]
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options:{
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // make sure to include the plugin for the magic
  ],
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'public'),
  },
};
