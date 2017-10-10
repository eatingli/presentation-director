
import { app, Menu, MenuItem, dialog, BrowserWindow } from 'electron'
const Const = require('../../common/const.js');

export class AppMenu {

    constructor() {
        this.options = {}
    }

    setDisplays(displays, callback) {
        this.options.displays = displays;
        this.options.displayClick = callback;
    }

    onPlayerFullScreen(callback) {
        this.options.onPlayerFullScreen = callback;
    }

    static addUpdateMenuItems(items, position) {
        if (process.mas) return

        const version = app.getVersion()
        let updateItems = [
            {
                label: `Version ${version}`,
                enabled: false
            }, {
                label: 'Checking for Update',
                enabled: false,
                key: 'checkingForUpdate'
            }, {
                label: 'Check for Update',
                visible: false,
                key: 'checkForUpdate',
                click: function () {
                    require('electron').autoUpdater.checkForUpdates()
                }
            }, {
                label: 'Restart and Install Update',
                enabled: true,
                visible: false,
                key: 'restartToUpdate',
                click: function () {
                    require('electron').autoUpdater.quitAndInstall()
                }
            }
        ]

        items.splice.apply(items, [position, 0].concat(updateItems))
    }



    get() {
        let options = this.options;
        let appMenu = [];

        appMenu.push({
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                }, {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                }, {
                    type: 'separator'
                }, {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                }, {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                }, {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                }, {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                }
            ]
        });

        appMenu.push({
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (item, focusedWindow) => {
                        if (focusedWindow) {
                            // on reload, start fresh and close any old open secondary windows
                            if (focusedWindow.id === 1) {
                                BrowserWindow.getAllWindows().forEach(function (win) {
                                    if (win.id > 1) win.close()
                                })
                            }
                            focusedWindow.reload()
                        }
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: () => (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11',
                    click: function (item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                        }
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: function (item, focusedWindow) {
                        if (focusedWindow) {
                            focusedWindow.toggleDevTools()
                        }
                    }
                },]
        });

        appMenu.push({
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                }, {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                }
            ]
        });

        // Mac
        if (process.platform === 'darwin') {
            const name = app.getName()
            appMenu.unshift({
                label: name,
                submenu: [{
                    label: `About ${name}`,
                    role: 'about'
                }, {
                    type: 'separator'
                }, {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                }, {
                    type: 'separator'
                }, {
                    label: `Hide ${name}`,
                    accelerator: 'Command+H',
                    role: 'hide'
                }, {
                    label: 'Hide Others',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                }, {
                    label: 'Show All',
                    role: 'unhide'
                }, {
                    type: 'separator'
                }, {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function () {
                        app.quit()
                    }
                }]
            })

            // Window menu.
            appMenu[3].submenu.push(
                { type: 'separator' },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                }
            )

            AppMenu.addUpdateMenuItems(appMenu[0].submenu, 1)
        }

        // Windows
        if (process.platform === 'win32') {
            const helpMenu = appMenu[appMenu.length - 1].submenu
            AppMenu.addUpdateMenuItems(helpMenu, 0)
        }

        // Player
        appMenu.push({
            label: 'Player',
            submenu: [{
                label: 'Select Screen',
                submenu: options.displays && options.displays.map((display, index) => (
                    {
                        label: `Display${index + 1}(${display.bounds.width}x${display.bounds.height})`,
                        type: 'radio',
                        checked: options.displays.length > 1 ? index == 1 : index == 0,
                        click: (item, focusedWindow) => {
                            let d = display;
                            options.displayClick && options.displayClick(d);
                        }
                    }
                ))
            }, {
                label: 'Full Screen',
                type: 'checkbox',
                checked: true,
                click: (item, focusedWindow) => {
                    options.onPlayerFullScreen && options.onPlayerFullScreen(item.checked)
                }
            }]
        });

        return Menu.buildFromTemplate(appMenu)
    }

}


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
    label: 'Refresh Path',
    click: function (item, focusedWindow) {
        focusedWindow.webContents.send(Const.IPC.MENU_MEDIA_LIST, Const.IPC.MENU_MEDIA_LIST_.REFRESH_PATH);
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