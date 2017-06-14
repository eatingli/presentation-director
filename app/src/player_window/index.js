const Electron = require('electron')
const ipc = Electron.ipcRenderer

ipc.on('data', (event, arg) => {
    document.getElementById('display').innerHTML = arg;
    console.log(3);
});

