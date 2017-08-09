
import { Menu, MenuItem } from 'electron'
const Const = require('../../common/const.js');

export const mediaListOptionMeun = new Menu();

mediaListOptionMeun.append(new MenuItem({
    label: 'Select Path',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST_OPTION.SELECT_PATH);
    }
}))

mediaListOptionMeun.append(new MenuItem({
    label: 'New Media',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST_OPTION.NEW_MEDIA);
    }
}))

export const mediaItemMeun = new Menu();

mediaItemMeun.append(new MenuItem({
    label: 'Rename',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_ITEM.RENAME);
    }
}))

mediaItemMeun.append(new MenuItem({
    label: 'Delete',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_ITEM.DELETE);
    }
}))