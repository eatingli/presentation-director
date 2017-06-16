import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';

// const Template = (props) => (
//     <div>
//         <h1>Template 1</h1>
//         <p>Content: {props.content}</p>
//     </div>
// )
// const Template = require('../templates/Template1.jsx').default

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            template: 'Black',
            content: ''
        }
    }

    componentDidMount() {
        /**
         * Receive
         */
        ipc.on('CONTENT', (event, arg) => {
            this.setState({ content: JSON.parse(arg) });
            console.log('Content: ', arg);
        });

        ipc.on('TEMPLATE', (event, arg) => {
            if (this.state.template !== arg)
                this.setState({ template: arg });
            console.log('Template: ', arg);
        });
    }

    render() {

        // Hot require Template components
        let Template = require('../templates/' + this.state.template + '.jsx').default
        if (!Template) throw new Error('Template Load Error');

        /**
         * 
         */
        return (
            <div>
                <Template content={this.state.content} />
            </div>
        )
    }
}

export default App