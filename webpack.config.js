let path = require('path');
let autoprefixer = require('autoprefixer');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');




let conf = {

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js',
        publicPath: ''
    },


    devServer: {
        overlay: true
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                'style-loader',
                MiniCssExtractPlugin.loader,

                {
                    loader: 'css-loader',
                    options: { sourceMap: false }
                }, {
                    loader: 'resolve-url-loader',
                    options: { sourceMap: true, }
                }, {
                    loader: 'sass-loader',
                    options: { includePaths: require('bourbon').includePaths, sourceMap: true, sourceMap: false }

                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers: ['ie >= 8', 'last 4 version']
                            })
                        ],
                        sourceMap: false,
                        config: { path: 'src/postcss.config.js' },
                    }
                }
            ],
        }, ]
    },

    plugins: [


        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),

        new MiniCssExtractPlugin({
            filename: "min.css",
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })

    ]
};


module.exports = (env, options) => {
    let production = options.mode == 'production';
    conf.devtool = production ?
        'source-map' :
        'eval-sourcemap';

    return conf;
}