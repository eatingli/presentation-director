
import { Menu, MenuItem } from 'electron'
const Const = require('../../common/const.js');

/**
 * Media List Option
 */
export const mediaListOptionMeun = new Menu();

mediaListOptionMeun.append(new MenuItem({
    label: 'Select Path',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST, Const.IPC.MENU_MEDIA_LIST_.SELECT_PATH);
    }
}))

mediaListOptionMeun.append(new MenuItem({
    label: 'New Media',
    submenu: [{
        label: 'SingleSong',
        click: function (item, focusedWindow) {
            focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST, Const.IPC.MENU_MEDIA_LIST_.SINGLE_SONG);
        }
    }, {
        label: 'MultiSong',
        click: function (item, focusedWindow) {
            focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST, Const.IPC.MENU_MEDIA_LIST_.MULTI_SONG);
        }
    }]
}))

/**
 * Media Item
 */
export const mediaItemMeun = new Menu();

mediaItemMeun.append(new MenuItem({
    label: 'Rename',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_ITEM, Const.IPC.MENU_MEDIA_ITEM_.RENAME);
    }
}))

mediaItemMeun.append(new MenuItem({
    label: 'Delete',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_ITEM, Const.IPC.MENU_MEDIA_ITEM_.DELETE);
    }
}))