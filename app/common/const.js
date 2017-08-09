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
    static SHOW_MENU_MEDIA_LIST_OPTION = 'SHOW_MENU_MEDIA_LIST_OPTION';
    static MENU_MEDIA_LIST_OPTION = {
        SELECT_PATH: 'MENU_MEDIA_LIST_OPTION_1',
        NEW_MEDIA: 'MENU_MEDIA_LIST_OPTION_2'
    }
    
    static SHOW_MENU_MEDIA_ITEM = 'SHOW_MENU_MEDIA_ITEM';
    static MENU_MEDIA_ITEM = {
        RENAME: 'MENU_MEDIA_ITEM_1',
        DELETE: 'MENU_MEDIA_ITEM_2',
    }
}