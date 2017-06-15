
const Electron = require('electron')
const { app, globalShortcut, BrowserWindow, ipcMain } = Electron
const DEV_MODE = process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development';
const path = require('path')
const url = require('url')

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
    console.log(process.env.NODE_ENV);
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
 * Build up main window
 */
function createMainWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1000, height: 700 })

    // Load app index page.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './main_window.html'),
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

    let playerWindow = new BrowserWindow({
        title: 'Player Window',
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        // kiosk: true,
        // frame: false,
        // alwaysOnTop: true,
        // focusable: false,
    })


    // Load app index page.
    playerWindow.loadURL(url.format({
        pathname: path.join(__dirname, './player_window.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    if (DEV_MODE)
        playerWindow.webContents.openDevTools()

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
    }

    /**
     * Creat Main Window
     */
    createMainWindow();

    /**
     * 
     */
    ipcMain.on('PLAYER_TEMPLATE', (event, arg) => {
        if (isPlayerWindowShow()) {
            playerWindow.webContents.send('TEMPLATE', arg);
        }
    })

    /**
     * 
     */
    ipcMain.on('PLAYER_CONTENT', (event, arg) => {

        if (isPlayerWindowShow()) {
            playerWindow.webContents.send('CONTENT', arg);
        }
    })

    /**
    * Toggle Player Show
    */
    ipcMain.on('PLAYER_TOGGLE', (event, arg) => {

        if (!isPlayerWindowShow()) {

            // Show Player Window
            let externalDisplay = getExternalDisplay();
            if (externalDisplay)
                playerWindow = creatPlayerWindow(externalDisplay.bounds);
            else
                playerWindow = creatPlayerWindow({ x: 0, y: 0, width: 500, height: 500 });

            mainWindow.webContents.send('PLAYER_OPEN', '');

            playerWindow.on('closed', function () {
                playerWindow = null;
                if (mainWindow)
                    mainWindow.webContents.send('PLAYER_CLOSE', '');
            })

        } else if (playerWindow) {
            // Destroy Player Window
            playerWindow.destroy();
        }
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