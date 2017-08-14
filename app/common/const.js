export class IPC {

    /**
     * 基本控制
     */
    static SELECT_TEMPLATE = 'SELECT_TEMPLATE'; // Send / Receive
    static UPDATE_CONTENT = 'UPDATE_CONTENT'; // Send / Receive
    static TOGGLE_PLAYER = 'TOGGLE_PLAYER'; // Send
    static PLAYER_OPEN = 'PLAYER_OPEN'; // Receive    
    static PLAYER_CLOSE = 'PLAYER_CLOSE'; // Receive

    /**
     * 路徑選擇
     */
    static SHOW_PATH_DIALOG = 'SHOW_PATH_DIALOG';
    static SELECT_PATH = 'SELECT_PATH';

    /**
     * 選單
     */
    static MENU_MEDIA_LIST = 'MENU_MEDIA_LIST';
    static MENU_MEDIA_LIST_ = {
        SELECT_PATH: 'A0',
        NEW_MEDIA: 'B0',
        SINGLE_SONG: 'B1',
        MULTI_SONG: 'B2',
    }

    static MENU_MEDIA_ITEM = 'MENU_MEDIA_ITEM';
    static MENU_MEDIA_ITEM_ = {
        RENAME: 'A',
        DELETE: 'B',
    }

    /**
     * New Media
     */
    static NEW_MEDIA_DIALOG = 'NEW_MEDIA_DIALOG';
}