import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

        /**
         * Sent test message
         */
        setInterval(() => {
            let nowTime = new Date().getTime();
            ipc.send('PLAYER_TEMPLATE', nowTime);
            ipc.send('PLAYER_CONTENT', nowTime);
        }, 10)

        /**
         * 
         */
        ipc.on('PLAYER_OPEN', (event, arg) => {
            console.log('On PLAYER_OPEN: ', 'Template');
        });
        ipc.on('PLAYER_CLOSE', (event, arg) => {
            console.log('On PLAYER_CLOSE: ', 'Template');
        });

    }

    handleBtnClick() {
        console.log('click')
        ipc.send('PLAYER_TOGGLE', '');
    }

    render() {
        return (
            <div>
                <button onClick={this.handleBtnClick.bind(this)}>Show / Hide</button>
            </div>
        )
    }
}


export default App