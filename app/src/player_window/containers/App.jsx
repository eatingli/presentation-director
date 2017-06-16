import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            template: '',
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
            this.setState({ template: arg });
            console.log('On TEMPLATE: ', 'Template');
        });
    }

    render() {
        return (
            <div>
                <h1>{this.state.template}</h1>
                <p>Time: {this.state.content}</p>
            </div>
        )
    }
}

export default App