
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {
        homePage: './ReactScripts/Home.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true,
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { modules: true } }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            util: require.resolve('util/'),
            process: require.resolve('process/browser') // <-- polyfill process
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'  // <-- provide process globally
        })
    ],
    devtool: 'source-map'
};
