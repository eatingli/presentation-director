import React from 'react';
import Electron, { ipcRenderer } from 'electron';
import * as Consts from '../../../common/const.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            template: 'color',
            attribute: {},
            content: {},
        }
    }

    componentDidMount() {

        ipcRenderer.on(Consts.IPC.SELECT_TEMPLATE, (event, template) => {

            // 判定Template實際上有無變化
            if (this.state.template !== template) {
                this.setState({ template: template });
            }
            console.log('Template: ', template);
        });

        ipcRenderer.on(Consts.IPC.SET_ATTRIBUTE, (event, attribute) => {
            this.setState({ attribute: JSON.parse(attribute) })
            console.log('Attribute: ', attribute);
        });

        ipcRenderer.on(Consts.IPC.UPDATE_CONTENT, (event, content) => {
            this.setState({ content: JSON.parse(content) });
            console.log('Content: ', content);
        });
    }

    render() {

        // Hot require Template components
        let Template = require(`../../../templates/${this.state.template}/src/index.jsx`).default
        if (!Template) throw new Error('Template Load Error');

        /**
         * 
         */
        return (
            <Template attribute={this.state.attribute} content={this.state.content} />
        )
    }
}

export default App