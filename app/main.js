const Electron = require('electron')
const app = Electron.app
const BrowserWindow = Electron.BrowserWindow
const ipc = Electron.ipcMain

const path = require('path')
const url = require('url')


let mainWindow

/**
 * Build up main window
 */
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1000, height: 700 })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './src/main_window.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
        app.quit();
    })
}

/**
 * 
 */
app.on('ready', () => {

    // Development option
    // if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
    //     devShortcut();
    //     devTool();
    //     console.log('Development Mode');
    // }

    // 
    createWindow();

})

/**
 * 
 */
app.on('will-quit', function () {
    globalShortcut.unregisterAll()
})

/**
 * Quit when all windows are closed.
 */
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

/**
 * 
 */
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})