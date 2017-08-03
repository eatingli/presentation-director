import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';
import Ipc from '../service/ipc.jsx';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            template: 'SingleSongTitle',
            content: ''
        }
    }

    componentDidMount() {
        /**
         * Receive
         */
        Ipc.onUpdateContent((content) => {
            this.setState({ content: JSON.parse(content) });
            console.log('Content: ', content);
        });

        Ipc.onSelectTemplate((template) => {
            // 判定Template實際上有無變化
            if (this.state.template !== template) {
                this.setState({
                    template: template,
                });
            } else {

            }

            console.log('Template: ', template);
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
            <Template content={this.state.content} />
        )
    }
}

export default App