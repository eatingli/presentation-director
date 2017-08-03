export class IPC_CLINET {
    static SELECT_TEMPLATE = 'SELECT_TEMPLATE'; // Send / Receive
    static UPDATE_CONTENT = 'UPDATE_CONTENT';   // Send / Receive
    static TOGGLE_PLAYER = 'TOGGLE_PLAYER';     // Send
    static PLAYER_OPEN = 'PLAYER_OPEN';         // Receive    
    static PLAYER_CLOSE = 'PLAYER_CLOSE';       // Receive
}

export default class Const {
    static IPC_CLINET = IPC_CLINET;
}