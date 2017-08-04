import Path from 'path'
import React from 'react';
import Ipc from '../service/ipc.jsx'
import FileHelper from '../service/file-helper.jsx'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            path: '',
            mediaList: [],
            director: 'SingleSong',
        }

        this.selectTemplate = this.selectTemplate.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.fileHelper = null;
    }

    componentDidMount() {

        Ipc.onPlayerOpen(() => {
            console.log('On PLAYER_OPEN');
        });

        Ipc.onPlayerClose(() => {
            console.log('On PLAYER_CLOSE');
        });

        Ipc.onSelectPath((path) => {
            path = Path.normalize(path);
            console.log('On SELECT PATH', path);
            this.setState({ path: path });

            // FileHelper
            if (this.fileHelper)
                this.fileHelper.setDirPath(path);
            else {
                this.fileHelper = new FileHelper(path);
                // this.fileHelper.watch((fileList) => {
                //     console.log('file change!', fileList);
                //     this.updateMediaList(fileList);
                // });
            }

            this.fileHelper.updateFileList()
                .then((fileList) => {
                    this.updateMediaList(fileList);
                });
        });
    }

    updateMediaList(fileList) {
        this.setState({ mediaList: fileList });
    }

    /**
     * Director 調用
     */
    selectTemplate(template) {
        console.log('selectTemplate()');
        Ipc.selectTemplate(template);
    }

    updateContent(content) {
        console.log('updateContent()');
        Ipc.updateContent(JSON.stringify(content));
    }

    onLoadMeaia(callback) {
        callback(media);
    }

    saveMedia(media) {

    }

    /**
     * UI綁定
     */
    handlePlayClick() {
        console.log('handlePlayClick()');
        Ipc.togglePlayer();
    }

    handlePathClick() {
        console.log('handlePlayClick()');
        Ipc.showPathDialog();
    }

    handleMediaSelect(media) {
        console.log('handlePlayClick()', media);
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
                        <p>Path: {this.state.path || 'null'}</p>
                        <ul>
                            {
                                this.state.mediaList.map((media, i) => (
                                    <li key={i} onClick={() => { this.handleMediaSelect(media) }}>{media}</li>
                                ))
                            }
                        </ul>
                    </div>

                    {/* Play Button */}
                    <div>
                        <button onClick={this.handlePathClick.bind(this)}>Path</button>
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