import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        }
    }

    componentDidMount() {
        /**
         * Receive
         */
        ipc.on('CONTENT', (event, arg) => {
            this.setState({ content: arg });
            console.log('On CONTENT: ', arg);
        });

        ipc.on('TEMPLATE', (event, arg) => {
            console.log('On TEMPLATE: ', 'Template');
        });
    }

    render() {
        return (
            <div>
                <h1 id="display">Time: {this.state.content}</h1>
            </div>
        )
    }
}

export default App