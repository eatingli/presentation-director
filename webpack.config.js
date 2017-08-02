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
        "electron": "require('electron')",
    },

    /**
     * 
     */
    plugins: [
    ]
};

module.exports = config;