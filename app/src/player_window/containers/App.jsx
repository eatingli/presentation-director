import React from 'react';
import Electron from 'electron';
const ipc = Electron.ipcRenderer

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ''
        }
    }

    componentDidMount() {
        /**
         * Receive
         */
        ipc.on('data', (event, arg) => {
            this.setState({ data: arg });
            console.log('Receive: ', arg);
        });
    }

    render() {
        return (
            <div>
                <h1 id="display">{this.state.data}</h1>
            </div>
        )
    }
}

export default App