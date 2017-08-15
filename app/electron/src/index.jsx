import path from 'path'
import url from 'url'
import Electron, { app, globalShortcut, BrowserWindow, ipcMain, dialog } from 'electron'
import * as Const from '../../common/const.js'
import { mediaListOptionMeun, mediaItemMeun } from './menu.jsx'

const DEV_MODE = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development';

let mainWindow = null
let playerWindow = null

/**
 * Build up development tool
 */
function devTool() {

    // devtron
    require('devtron').install()

    // require
    const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS
    } = require('electron-devtools-installer');

    // REACT_DEVELOPER_TOOLS
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    // REDUX_DEVTOOLS
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
}

/**
 * Setup development shortcut
 */
function devShortcut() {

    // Esc -> Exit App
    globalShortcut.register('Escape', () =>
        app.quit()
    )

    // Ctrl + R -> Reload
    globalShortcut.register('Control+R', () =>
        mainWindow.webContents.reload()
    )

    // Ctrl + D -> Toggle Development Tool contents.toggleDevTools()
    globalShortcut.register('Control+D', () =>
        mainWindow.webContents.toggleDevTools()
    )
}

/**
 * Setup production shortcut
 */
function prodShortcut() {
    // Esc -> Close player
    globalShortcut.register('Escape', () =>
        playerWindow && playerWindow.destroy()
    )
}

/**
 * Build up main window
 */
function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800
    })

    // Load app index page.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../../main_window/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    if (DEV_MODE)
        mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
        app.quit()
    })
}

/**
 * 
 */
function getExternalDisplay() {
    var displays = Electron.screen.getAllDisplays();
    var externalDisplay = null;
    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i];
            break;
        }
    }

    return externalDisplay;
}

/**
 * 
 */
function creatPlayerWindow(bounds) {


    let config = {
        title: 'Player',
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        kiosk: true,
        frame: false,
        alwaysOnTop: true,
        focusable: false,
    }

    /**
     * Dev
     */
    if (DEV_MODE) {
        config.kiosk = false;
        config.frame = true;
        config.alwaysOnTop = false;
        config.focusable = true;
    }

    let playerWindow = new BrowserWindow(config)

    // Load app index page.
    playerWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../../player_window/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    // if (DEV_MODE)
    // playerWindow.webContents.openDevTools()

    return playerWindow;
}

function isPlayerWindowShow() {
    return playerWindow != null && !playerWindow.isDestroyed();
}

/**
 * Electron Ready
 */
app.on('ready', () => {

    /**
     * Development option
     */
    if (DEV_MODE) {
        devShortcut();
        devTool();
        console.log('Development Mode');
    } else {
        prodShortcut();
    }

    /**
     * Creat Main Window
     */
    createMainWindow();


    /**
     * Basic
     */
    ipcMain.on(Const.IPC.SELECT_TEMPLATE, (event, arg) => {
        console.log('on SELECT_TEMPLATE');
        if (isPlayerWindowShow()) {
            playerWindow.webContents.send(Const.IPC.SELECT_TEMPLATE, arg);
        }
    })

    ipcMain.on(Const.IPC.UPDATE_CONTENT, (event, arg) => {
        console.log('on UPDATE_CONTENT');
        if (isPlayerWindowShow()) {
            playerWindow.webContents.send(Const.IPC.UPDATE_CONTENT, arg);
        }
    })

    ipcMain.on(Const.IPC.TOGGLE_PLAYER, (event, arg) => {
        console.log('on TOGGLE_PLAYER');

        if (!isPlayerWindowShow()) {

            // Show Player Window
            let externalDisplay = getExternalDisplay();
            if (externalDisplay)
                playerWindow = creatPlayerWindow(externalDisplay.bounds);
            else
                playerWindow = creatPlayerWindow({
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 700
                });

            mainWindow.webContents.send(Const.IPC.PLAYER_OPEN, '');

            playerWindow.on('closed', function () {
                playerWindow = null;
                if (mainWindow)
                    mainWindow.webContents.send(Const.IPC.PLAYER_CLOSE, '');
            })

        } else if (playerWindow) {
            // Destroy Player Window
            playerWindow.destroy();
        }
    })

    /**
     * Menu
     */
    ipcMain.on(Const.IPC.MENU_MEDIA_ITEM, function (event) {
        const win = BrowserWindow.fromWebContents(event.sender);
        mediaItemMeun.popup(win);
    })

    ipcMain.on(Const.IPC.MENU_MEDIA_LIST, function (event) {
        const win = BrowserWindow.fromWebContents(event.sender);
        mediaListOptionMeun.popup(win);
    })

    /**
     * Dialog
     */
    ipcMain.on(Const.IPC.NEW_MEDIA_DIALOG, function (event, arg) {
        const options = {
            title: 'New',
            filters: [{ name: 'Media', extensions: ['json'] }]
        }
        dialog.showSaveDialog(options, function (filename) {
            if (filename) event.sender.send('NEW_MEDIA_DIALOG', filename)
        })
    })

    ipcMain.on(Const.IPC.MEDIA_RENAME_DIALOG, function (event, arg) {
        const options = {
            title: 'Rename',
            filters: [{ name: 'Media', extensions: ['json'] }]
        }
        dialog.showSaveDialog(options, function (filename) {
            if (filename) event.sender.send('MEDIA_RENAME_DIALOG', filename)
        })
    })

    ipcMain.on(Const.IPC.SELECT_PATH_DIALOG, function (event, arg) {
        const option = {
            title: 'Path',
            defaultPath: './',
            properties: ['openDirectory']
        };
        dialog.showOpenDialog(mainWindow, option, function (filePaths) {
            if (filePaths) mainWindow.webContents.send(Const.IPC.SELECT_PATH_DIALOG, filePaths[0]);
        });
    });

    ipcMain.on(Const.IPC.MEDIA_DELETE_DIALOG, function (event) {
        const options = {
            type: 'info',
            title: 'Warning',
            message: 'Are you sure to delete this media?',
            buttons: ['Yes', 'No']
        }
        dialog.showMessageBox(options, function (index) {
            let isDelete = (index == 0);
            event.sender.send(Const.IPC.MEDIA_DELETE_DIALOG, isDelete)
        })
    })


})

/**
 * Cencel short before quit
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
        createMainWindow()
    }
})