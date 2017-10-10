const path = require('path');
const webpack = require('webpack');

const config = {

    /**
     * 關閉nodejs的__filename和__dirname
     */
    node: {
        __filename: false,
        __dirname: false
    },

    /**
     * target
     */
    target: 'electron-renderer',

    /**
     * 每個Window也有獨立的JS檔
     */
    entry: {
        './app/main_window/build/bundle.js': './app/main_window/src/index.jsx',
        './app/player_window/build/bundle.js': './app/player_window/src/index.jsx'
    },

    /**
     * 輸出到指定路徑，並用entry的key作為檔名
     */
    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name]'
    },

    /**
     * 引用Loader。以正規表達式來選擇特定檔案，並指明loader
     */
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.txt$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        outputPath: 'app/main_window/build/',
                        publicPath: '../../' // 消除重複的路徑(app/main_window)
                    }
                }
            }],
    },

    /**
     * 排外的 Modules
     */
    externals: {
    },

    /**
     * 
     */
    plugins: []
};

module.exports = config;