/**
 * 監看特定目錄內的檔案
 * 提供目錄清單
 * 提供新增/刪除/更名 方法
 * 提供載入/儲存 方法
 */

const fs = require("fs");
const path = require("path");
const chokidar = require('chokidar');

export default class FileHelper {

    constructor(dirPath) {
        this.dirPath = '';
        this.watcher = null;
        this.onChange = () => { };
        this.setDirPath(dirPath);
    }

    setDirPath(dirPath) {
        this.dirPath = dirPath;

        // if (this.watcher != null)
        //     this.watcher.close();

        // this.watcher = chokidar.watch(dirPath, {
        //     ignored: /[\/\\]\./,
        //     persistent: true
        // });

        // let self = this;

        // async function fn(filePath) {
        //     if (path.dirname(filePath) === self.dirPath) {
        //         let fileList = await self.updateFileList();
        //         self.onChange(fileList);
        //     }
        // }

        // self.watcher.on('ready', function () {
        //     self.watcher
        //         .on('add', fn)
        //         .on('unlink', fn)
        // })
    }

    updateFileList() {

        let self = this;

        return new Promise((resolve, reject) => {

            // 讀取目錄下的所有檔名
            fs.readdir(self.dirPath, (err, fileNames) => {
                if (err) return reject(err);

                let conter = fileNames.length;

                // 迭代每個檔案
                let result = fileNames.filter((fileName) => {
                    let filePath = path.join(self.dirPath, fileName);
                    return fs.statSync(filePath).isFile();
                })
                resolve(result);
            });
        });
    }

    static extnameFilter(fileNames, extname) {
        return new Promise((resolve, reject) => {

            if (extname && extname.length > 0 && extname[0] !== '.') extname = '.' + extname;

            let result = fileNames.filter((fileName) =>
                path.extname(fileName) === extname
            )
            resolve(result);
        })
    }

    static getFilename(file) {
        return path.basename(file).replace(path.extname(file), '');
    }

    watch(callback) {
        this.onChange = callback;
    }

    newFile(filename, ) {

        return new Promise((resolve, reject) => {

            // 開新檔案，如果路徑已存在則發生例外
            fs.open(path.join(this.dirPath, filename), 'wx+', (err, fd) => {
                if (err) return reject(err);

                //關閉檔案
                fs.close(fd, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

    }

    deleteFile(filename) {

        return new Promise((resolve, reject) => {
            // 檔案不存在則失敗
            fs.unlink(path.join(this.dirPath, filename), (err) => {
                if (err) reject(err);
                else resolve();
            })
        });
    }

    editFilename(oldName, newName) {

        return new Promise((resolve, reject) => {

            let oldPath = path.join(this.dirPath, oldName);
            let newPath = path.join(this.dirPath, newName);

            fs.rename(oldPath, newPath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    saveFile(filename, data) {

        return new Promise((resolve, reject) => {

            let file = path.join(this.dirPath, filename);
            fs.writeFile(file, data, {
                encoding: 'utf8',
                flag: 'w'
            }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    loadFile(filename) {

        return new Promise((resolve, reject) => {

            let file = path.join(this.dirPath, filename);
            fs.readFile(file, {
                encoding: 'utf8',
                flag: 'r'
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}


/**
 * Test
 */
require.main === module ? (async () => {

    let fileHelper = new FileHelper(path.join(__dirname, './test-dir'));

    fileHelper.watch((fileList) => {
        console.log('change!');
        console.log(fileList);
    });

    let file = 'test.gg';
    let newName = 'ccccccc.aaaaaa';

    try {
        console.log('-------------Test--------------');
        console.log(await fileHelper.updateFileList());

        // 新檔案
        await fileHelper.newFile(file);
        console.log('newFile() success!');
        console.log(await fileHelper.updateFileList());

        // 載入
        var data = await fileHelper.loadFile(file);
        console.log('loadFile() success!');
        console.log('data:', data);

        // 儲存
        let newData = data + 'test!!!';
        await fileHelper.saveFile(file, newData);
        console.log('saveFile() success!');

        // 載入
        var data = await fileHelper.loadFile(file);
        console.log('loadFile() success!');
        console.log('data:', data);

        // 更名
        await fileHelper.editFilename(file, newName);
        console.log('editFilename() success!');
        console.log(await fileHelper.updateFileList());

        // 刪除
        await fileHelper.deleteFile(newName);
        console.log('deleteFile() success!');
        console.log(await fileHelper.updateFileList());
    } catch (err) {
        console.error(err);
    }

})() : '';