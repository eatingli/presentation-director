const path = require('path');
const webpack = require('webpack');

const config = {

    /**
     * 每個Window也有獨立的JS檔
     */
    entry: {
        main_window: ['./app/src/main_window/index.jsx']
    },

    /**
     * 輸出到指定路徑，並用entry的key作為檔名
     */
    output: {
        path: path.resolve(__dirname, './app/build'),
        filename: '[name].bundle.js'
    },

    /**
     * 引用Loader。以正規表達式來選擇特定檔案，並指明loader
     * 此.jsx? 代表.js 或者 .jsx
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
        ],
    },

    /**
     * 排外的 Modules
     */
    externals: {
    },

    /**
     * 
     */
    plugins: [
        // new webpack.ExternalsPlugin('commonjs', ['fs']),
        // new webpack.IgnorePlugin(/vertx/)
    ]
};

module.exports = config;