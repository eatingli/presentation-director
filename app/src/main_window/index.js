const path = require('path')
const url = require('url')
const Electron = require('electron')
const BrowserWindow = Electron.remote.BrowserWindow
const electronScreen = Electron.remote.screen
const ipc = Electron.ipcRenderer

let playerWindow

function getExternalDisplay() {
    var displays = electronScreen.getAllDisplays();
    var externalDisplay = null;
    for (var i in displays) {
        if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
            externalDisplay = displays[i];
            break;
        }
    }

    return externalDisplay;
}

function creatPlayerWindow(bounds) {

    let playerWindow = new BrowserWindow({
        title: 'Player Window',
        x: bounds.x,
        y: bounds.y,
        kiosk: true,
        frame: false,
        alwaysOnTop: true,
        focusable: false,
    })

    // and load the index.html of the app.
    playerWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../player_window.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    playerWindow.on('closed', () => {
        playerWindow = null;
    })

    playerWindow.webContents.openDevTools()

    return playerWindow;
}

const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    if (!playerWindow || playerWindow.isDestroyed()) {
        // Show Player Window
        let externalDisplay = getExternalDisplay();
        if (!externalDisplay) return;
        playerWindow = creatPlayerWindow(externalDisplay.bounds);
    } else {
        // Destroy Player Window
        playerWindow.destroy();
    }

});

setInterval(() => {
    if (playerWindow && !playerWindow.isDestroyed()) {
        let nowTime = new Date().getTime();
        playerWindow.webContents.send('data', 'time: ' + nowTime);
    }
}, 10)
