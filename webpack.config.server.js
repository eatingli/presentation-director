const path = require('path');
const webpack = require('webpack');

const config = {

    /**
     * 開啟nodejs的__filename和__dirname
     */
    node: {
        __filename: true,
        __dirname: true
    },

    /**
     * target
     */
    target: 'electron-main',

    /**
     * 每個Window也有獨立的JS檔
     */
    entry: {
        bundle: './app/electron/src/index.js',
    },

    /**
     * 輸出到指定路徑，並用entry的key作為檔名
     */
    output: {
        path: path.resolve(__dirname, './'),
        filename: './app/electron/build/[name].js'
    },

    /**
     * 引用Loader。以正規表達式來選擇特定檔案，並指明loader
     * 此.jsx? 代表.js 或者 .jsx
     */
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        }, ],
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