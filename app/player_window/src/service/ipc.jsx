import Electron, { ipcRenderer } from 'electron';
import { IPC as Const } from '../../../common/const.js';

export default class Ipc {

    static onSelectTemplate(callback) {
        ipcRenderer.on(Const.SELECT_TEMPLATE, (event, arg) => {
            callback(arg);
        });
    }

    static onUpdateContent(callback) {
        ipcRenderer.on(Const.UPDATE_CONTENT, (event, arg) => {
            callback(arg);
        });
    }

}