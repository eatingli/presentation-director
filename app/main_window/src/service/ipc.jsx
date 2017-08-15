import Electron, { ipcRenderer } from 'electron';
import { IPC as Const } from '../../../common/const.js';

export default class Ipc {

    /**
     * Basic
     */
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


    /**
     * Menu
     */
    static showMenuMediaListOption() {
        ipcRenderer.send(Const.MENU_MEDIA_LIST, '');
    }

    static showMenuMediaItem() {
        ipcRenderer.send(Const.MENU_MEDIA_ITEM, '');
    }

    static onMenuMediaList(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_LIST, (event, flag) => {
            callback(flag);
        })
    }

    static onMenuMediaItem(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_ITEM, (event, flag) => {
            callback(flag);
        })
    }

    /**
     * Dialog
     */
    static showPathDialog() {
        ipcRenderer.send(Const.SELECT_PATH_DIALOG, '');
    }

    static onSelectPath(callback) {
        ipcRenderer.on(Const.SELECT_PATH_DIALOG, (event, path) => {
            callback(path);
        });
    }

    static showNewMediaDialog() {
        ipcRenderer.send(Const.NEW_MEDIA_DIALOG, '');
    }

    static onNewMedia(callback) {
        ipcRenderer.on(Const.NEW_MEDIA_DIALOG, (event, filename) => {
            callback(filename);
        });
    }

    static showMediaRenameDialog() {
        ipcRenderer.send(Const.MEDIA_RENAME_DIALOG, '');
    }

    static onMediaRename(callback) {
        ipcRenderer.on(Const.MEDIA_RENAME_DIALOG, (event, filename) => {
            callback(filename);
        });
    }
}




