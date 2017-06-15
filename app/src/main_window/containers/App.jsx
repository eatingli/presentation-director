import React from 'react';

import path from 'path';
import url from 'url';
import Electron from 'electron';
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
        width: bounds.width,
        height: bounds.height,
        // kiosk: true,
        // frame: false,
        // alwaysOnTop: true,
        // focusable: false,
    })


    // and load the index.html of the app.
    playerWindow.loadURL(url.format({
        pathname: path.join(__dirname),
        protocol: 'file:',
        slashes: false
    }));

    console.log(url.format({
        pathname: path.join(__dirname, '..', '..', '..', 'player_window.html'),
        protocol: 'file:',
        slashes: false
    }));

    console.log(path.join(__dirname));
    console.log(path.join(__dirname, '..'));
    console.log(path.join(__dirname, '..', '..'));
    // console.log(path.resolve(__dirname));

    // Emitted when the window is closed.
    playerWindow.on('closed', () => {
        playerWindow = null;
    })

    playerWindow.webContents.openDevTools()

    return playerWindow;
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

        /**
         * Sent test message
         */
        setInterval(() => {
            if (playerWindow && !playerWindow.isDestroyed()) {
                let nowTime = new Date().getTime();
                playerWindow.webContents.send('data', nowTime);
            }
        }, 10)
    }

    handleBtnClick() {
        console.log('playerWindow.. ', playerWindow);

        if (!playerWindow || playerWindow.isDestroyed()) {

            // Show Player Window
            let externalDisplay = getExternalDisplay();
            if (externalDisplay)
                playerWindow = creatPlayerWindow(externalDisplay.bounds);
            else
                /**
                 * test
                 */
                playerWindow = creatPlayerWindow({ x: 0, y: 0, width: 500, height: 500 });

        } else {
            // Destroy Player Window
            playerWindow.destroy();
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.handleBtnClick.bind(this)}>Show / Hide</button>
            </div>
        )
    }
}


export default App