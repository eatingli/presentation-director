import React from 'react';
import ipc from '../service/ipc.js'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            director: 'SingleSong',
        }

        this.selectTemplate = this.selectTemplate.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    componentDidMount() {
        ipc.onPlayerOpen(() => {
            console.log('On PLAYER_OPEN');
        });
        ipc.onPlayerClose(() => {
            console.log('On PLAYER_CLOSE');
        });
    }

    selectTemplate(template) {
        console.log('selectTemplate');
        ipc.selectTemplate(template);
    }

    updateContent(content) {
        console.log('updateContent');
        ipc.updateContent(JSON.stringify(content));
    }

    handlePlayClick() {
        console.log('handlePlayClick');
        ipc.togglePlayer();
    }

    render() {

        // Hot require Director components
        let Director = require('../directors/' + this.state.director + '.jsx').default
        if (!Director) throw new Error('Director Load Error');

        /**
         * 
         */
        return (
            <div>

                {/* Left Container */}
                <div>

                    {/* Media List Title */}
                    <div>
                        <h2>Media List</h2>
                    </div>

                    {/* Media List */}
                    <div>
                        <ul>
                            <li onClick={() => { this.setState({ director: 'Song1' }) }}>Song1</li>
                            <li onClick={() => { this.setState({ director: 'Song2' }) }}>Song2</li>
                        </ul>
                    </div>

                    {/* Play Button */}
                    <div>
                        <button onClick={this.handlePlayClick.bind(this)}>Play</button>
                    </div>
                </div>

                {/* Right Container */}
                <div>

                    {/* Media Title */}
                    <div>
                        <h1>{this.state.director}</h1>
                    </div>

                    {/* Director */}
                    <div>
                        <Director selectTemplate={this.selectTemplate} updateContent={this.updateContent} />
                    </div>

                    {/* Function Row */}
                    <div>
                        <h2>Function</h2>
                        <button onClick={() => { this.selectTemplate('Black') }}>Black</button>
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