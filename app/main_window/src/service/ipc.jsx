import Electron, { ipcRenderer } from 'electron';
import { IPC as Const } from '../../../common/const.js';

export default class Ipc {

    /**
     * 
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
     * 
     */
    static showPathDialog() {
        ipcRenderer.send(Const.SHOW_PATH_DIALOG, '');
    }

    static onSelectPath(callback) {
        ipcRenderer.on(Const.SELECT_PATH, (event, path) => {
            callback(path);
        });
    }

    /**
     * 選單
     */
    static showMenuMediaListOption() {
        ipcRenderer.send(Const.SHOW_MENU_MEDIA_LIST_OPTION, '');
    }

    static showMenuMediaItem() {
        ipcRenderer.send(Const.SHOW_MENU_MEDIA_ITEM, '');
    }

    static onMeunMediaListSelectPath(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_LIST_OPTION.SELECT_PATH, (event, arg) => {
            callback();
        })
    }

    static onMenuMediaListNewMedia(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_LIST_OPTION.NEW_MEDIA, (event, arg) => {
            callback();
        })
    }

    static onMenuMediaItemRename(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_ITEM.RENAME, (event, arg) => {
            callback();
        })
    }

    static onMenuMediaItemDelete(callback) {
        ipcRenderer.addListener(Const.MENU_MEDIA_ITEM.DELETE, (event, arg) => {
            callback();
        })
    }
}




