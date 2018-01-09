import Electron, { ipcRenderer } from 'electron';
import * as Consts from '../../../common/const.js';

export default class Ipc {

    /**
     * Basic
     */
    static selectTemplate(template) {
        ipcRenderer.send(Consts.IPC.SELECT_TEMPLATE, template);
    }

    static setAttribute(attribute) {
        ipcRenderer.send(Consts.IPC.SET_ATTRIBUTE, attribute);
    }

    static updateContent(content) {
        ipcRenderer.send(Consts.IPC.UPDATE_CONTENT, content);
    }

    static togglePlayer() {
        ipcRenderer.send(Consts.IPC.TOGGLE_PLAYER, '');
    }

    static onPlayerOpen(callback) {
        ipcRenderer.on(Consts.IPC.PLAYER_OPEN, (event, arg) => {
            callback();
        });
    }

    static onPlayerClose(callback) {
        ipcRenderer.on(Consts.IPC.PLAYER_CLOSE, (event, arg) => {
            callback();
        });
    }


    /**
     * Menu
     */
    static showMenuMediaListOption() {
        ipcRenderer.send(Consts.IPC.MENU_MEDIA_LIST, '');
    }

    static showMenuMediaItem() {
        ipcRenderer.send(Consts.IPC.MENU_MEDIA_ITEM, '');
    }

    static onMenuMediaList(callback) {
        ipcRenderer.addListener(Consts.IPC.MENU_MEDIA_LIST, (event, flag) => {
            callback(flag);
        })
    }

    static onMenuMediaItem(callback) {
        ipcRenderer.addListener(Consts.IPC.MENU_MEDIA_ITEM, (event, flag) => {
            callback(flag);
        })
    }

    /**
     * Dialog
     */
    static showPathDialog() {
        ipcRenderer.send(Consts.IPC.SELECT_PATH_DIALOG, '');
    }

    static onSelectPath(callback) {
        ipcRenderer.on(Consts.IPC.SELECT_PATH_DIALOG, (event, path) => {
            callback(path);
        });
    }

    static showNewMediaDialog() {
        ipcRenderer.send(Consts.IPC.NEW_MEDIA_DIALOG, '');
    }

    static onNewMedia(callback) {
        ipcRenderer.on(Consts.IPC.NEW_MEDIA_DIALOG, (event, filename) => {
            callback(filename);
        });
    }

    static showMediaRenameDialog() {
        ipcRenderer.send(Consts.IPC.MEDIA_RENAME_DIALOG, '');
    }

    static onMediaRename(callback) {
        ipcRenderer.on(Consts.IPC.MEDIA_RENAME_DIALOG, (event, filename) => {
            callback(filename);
        });
    }

    static showMediaDeleteDialog() {
        ipcRenderer.send(Consts.IPC.MEDIA_DELETE_DIALOG, '');
    }

    static onMediaDelete(callback) {
        ipcRenderer.on(Consts.IPC.MEDIA_DELETE_DIALOG, (event, isDelete) => {
            callback(isDelete);
        });
    }
}




