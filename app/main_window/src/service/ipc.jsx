import Electron, { ipcRenderer } from 'electron';
import {IPC_CLINET as Const} from '../../../common/const.js';

export default class Ipc {

    static selectTemplate(template) {
        ipcRenderer.send(Const.SELECT_TEMPLATE, template);
    }

    static updateContent(content) {
        ipcRenderer.send(Const.UPDATE_CONTENT, content);
    }

    static togglePlayer() {
        ipcRenderer.send(Const.TOGGLE_PLAYER, '');
    }

    static onPlayerOpen(callback) {
        ipcRenderer.on(Const.PLAYER_OPEN, (event, arg) => {
            callback();
        });
    }

    static onPlayerClose(callback) {
        ipcRenderer.on(Const.PLAYER_CLOSE, (event, arg) => {
            callback();
        });
    }

}