import path from 'path'
import url from 'url'
import Electron, { app, Menu, globalShortcut, BrowserWindow, ipcMain, dialog } from 'electron'
import * as Const from '../../common/const.js'
import { mediaListOptionMeun, mediaItemMeun, AppMenu } from './menu.jsx'

const DEV_MODE = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development';

let mainWindow = null
let playerWindow = null
let playerDisplay = null
let isPlayerFullScreen = !DEV_MODE;


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
        height: 800,
        kiosk: false,
        frame: true,
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
function getDefaultDisplay() {
    let displays = Electron.screen.getAllDisplays();
    let primaryDisplay = Electron.screen.getPrimaryDisplay();
    if (displays.length > 1) {
        return displays.splice(displays.indexOf(primaryDisplay), 1)[0];
    } else {
        return primaryDisplay;
    }
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
    }

    if (isPlayerFullScreen) {

        config.frame = false;
        config.alwaysOnTop = true;
        config.resizable = false;

        // 根據作業系統，全螢幕的解決方案不同
        if (process.platform === 'darwin') {
            config.fullscreen = true;
        } else {
            config.kiosk = true;
            config.focusable = false;
        }
    } else {
        config.kiosk = false;
        config.frame = true;
        config.alwaysOnTop = false;
        config.focusable = true;
        config.fullscreen = false;
    }

    let playerWindow = new BrowserWindow(config)

    // Load app index page.
    playerWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../../player_window/index.html'),
        protocol: 'file:',
        slashes: true
    }));


    return playerWindow;
}

function isPlayerWindowShow() {
    return playerWindow != null && !playerWindow.isDestroyed();
}


// ----------------------------------------------------------------------------------------------------------------

/**
 * Electron Ready
 */
app.on('ready', () => {

    /**
     * Development option
     */
    if (DEV_MODE) {
        // devTool();
        console.log('Development Mode');
    } else {
        prodShortcut();
    }

    // Setup app menu
    let setupMenu = () => {
        let appMenu = new AppMenu();
        appMenu.setDisplays(Electron.screen.getAllDisplays(), (selectedDisplay) => {
            playerDisplay = selectedDisplay;
        });
        appMenu.onPlayerFullScreen((bool) => { isPlayerFullScreen = bool })
        Menu.setApplicationMenu(appMenu.get());
    }
    setupMenu();

    // 監聽螢幕硬體變化
    let onScreenChange = () => {
        setupMenu();
        playerDisplay = getDefaultDisplay();
    }
    Electron.screen.on('display-added', onScreenChange)
    Electron.screen.on('display-removed', onScreenChange)

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
            let externalDisplay = playerDisplay || getDefaultDisplay();
            playerWindow = creatPlayerWindow({ ...externalDisplay.bounds, width: 800, height: 750 });

            mainWindow.webContents.send(Const.IPC.PLAYER_OPEN, '');

            playerWindow.once('closed', function () {
                playerWindow = null;
                if (mainWindow) {
                    mainWindow.webContents.send(Const.IPC.PLAYER_CLOSE, '');
                }
            })

        } else if (playerWindow) {
            // Close Player Window
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
    app.quit()
})

/**
 * 
 */
app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow()
    }
})