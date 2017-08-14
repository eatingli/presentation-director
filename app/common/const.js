export class IPC {

    /**
     * 基本控制
     */
    static SELECT_TEMPLATE = 'SELECT_TEMPLATE';
    static UPDATE_CONTENT = 'UPDATE_CONTENT';
    static TOGGLE_PLAYER = 'TOGGLE_PLAYER';
    static PLAYER_OPEN = 'PLAYER_OPEN';
    static PLAYER_CLOSE = 'PLAYER_CLOSE';

    /**
     * 路徑選擇
     */
    static SHOW_PATH_DIALOG = 'SHOW_PATH_DIALOG';
    static SELECT_PATH = 'SELECT_PATH';

    /**
     * Menu
     */
    static MENU_MEDIA_LIST = 'MENU_MEDIA_LIST';
    static MENU_MEDIA_LIST_ = {
        SELECT_PATH: 'A0',
        REFRESH_PATH: 'B0',
        NEW_MEDIA: 'D0',
        SINGLE_SONG: 'D1',
        MULTI_SONG: 'D2',
    }

    static MENU_MEDIA_ITEM = 'MENU_MEDIA_ITEM';
    static MENU_MEDIA_ITEM_ = {
        RENAME: 'A0',
        DELETE: 'B0',
    }

    /**
     * Dialog
     */
    static NEW_MEDIA_DIALOG = 'NEW_MEDIA_DIALOG';
    static MEDIA_RENAME_DIALOG = 'MEDIA_RENAME_DIALOG';

}