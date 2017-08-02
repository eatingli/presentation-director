import Electron, { ipcRenderer } from 'electron';
import Const from '../const/const.js';

export default class ipc {
    static selectTemplate(template) {
        ipcRenderer.send(Const.IPC_SELECT_TEMPLATE, template);
    }

    static updateContent(content) {
        ipcRenderer.send(Const.IPC_UPDATE_CONTENT, content);
    }

    static togglePlayer() {
        ipcRenderer.send(Const.IPC_TOGGLE_PLAYER, '');
    }

    static onPlayerOpen(callback) {
        ipcRenderer.on(Const.IPC_PLAYER_OPEN, (event, arg) => {
            callback();
        });
    }

    static onPlayerClose(callback) {
        ipcRenderer.on(Const.IPC_PLAYER_CLOSE, (event, arg) => {
            callback();
        });
    }

}