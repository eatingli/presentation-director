import React from 'react';
import Electron, { ipcRenderer as ipc } from 'electron';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            director: 'Test1',
        }

        this.selectTemplate = this.selectTemplate.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    componentDidMount() {

        ipc.on('PLAYER_OPEN', (event, arg) => {
            console.log('On PLAYER_OPEN: ', 'Template');
        });
        ipc.on('PLAYER_CLOSE', (event, arg) => {
            console.log('On PLAYER_CLOSE: ', 'Template');
        });

    }

    selectTemplate(template) {
        ipc.send('PLAYER_TEMPLATE', template);
    }

    updateContent(content) {
        ipc.send('PLAYER_CONTENT', content);
    }

    handlePlayToggle() {
        console.log('click')
        ipc.send('PLAYER_TOGGLE', '');
    }

    render() {

        // Hot require director components
        let Director = require('../components/' + this.state.director + '.jsx').default

        /**
         * 
         */
        return (
            <div>

                {/* Left Container */}
                <div>

                    {/* Media List Title */}
                    <div>Media List</div>

                    {/* Media List */}
                    <div>
                        <ul>
                            <li onClick={() => { this.setState({ director: 'Test1' }) }}>Test1</li>
                            <li onClick={() => { this.setState({ director: 'Test2' }) }}>Test2</li>
                        </ul>
                    </div>

                    {/* Play Button */}
                    <div>
                        <button onClick={this.handlePlayToggle.bind(this)}>Play</button>
                    </div>
                </div>

                {/* Right Container */}
                <div>

                    {/* Media Title */}
                    <div>
                        {this.state.director}
                    </div>

                    {/* Director */}
                    <div>
                        <Director selectTemplate={this.selectTemplate} updateContent={this.updateContent} />
                    </div>

                    {/* Function Row */}
                    <div>
                        <button>FN-1</button>
                        <button>FN-2</button>
                        <button>FN-3</button>
                        <button>FN-4</button>
                    </div>
                </div>

            </div>
        )
    }
}


export default App