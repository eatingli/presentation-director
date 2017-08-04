import React from 'react';
import Ipc from '../service/ipc.jsx'

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
        Ipc.onPlayerOpen(() => {
            console.log('On PLAYER_OPEN');
        });
        Ipc.onPlayerClose(() => {
            console.log('On PLAYER_CLOSE');
        });
    }
    /**
     * Director 調用
     */
    selectTemplate(template) {
        console.log('selectTemplate');
        Ipc.selectTemplate(template);
    }

    updateContent(content) {
        console.log('updateContent');
        Ipc.updateContent(JSON.stringify(content));
    }

    onLoadMeaia(callback) {
        callback(media);
    }

    saveMedia(media) {

    }

    //
    handlePlayClick() {
        console.log('handlePlayClick');
        Ipc.togglePlayer();
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
                            <li>Song1</li>
                            <li>Song2</li>
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