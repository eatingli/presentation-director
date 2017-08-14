import Path from 'path'
import React from 'react';
import Ipc from '../service/ipc.jsx'
import FileHelper from '../service/file-helper.jsx'

import { GridStyle, MainStyle } from '../styles/main.jsx';
import MediaItem from '../components/MediaItem.jsx';
import { IPC as Const } from '../../../common/const.js';
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            path: '',
            fileList: [],
            mediaList: [],
            selectedMedia: -1,
            contextMenuTargetMedia: -1,

            // director: 'SingleSong',
            director: 'MultiSong',
        }

        this.selectTemplate = this.selectTemplate.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onLoadMedia = this.onLoadMedia.bind(this);
        this.saveMedia = this.saveMedia.bind(this);
        this.fileHelper = null;
        this.loadMedia = () => { };

        this.handleMediaListOptionClick = this.handleMediaListOptionClick.bind(this);
        this.handleMediaItemContextMenu = this.handleMediaItemContextMenu.bind(this);
        this.handleMediaItemClick = this.handleMediaItemClick.bind(this);

    }

    componentDidMount() {

        /**
         * IPC 事件
         */
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
            }

            let fileHelper = this.fileHelper;

            this.fileHelper.updateFileList()
                .then((files) => FileHelper.extnameFilter(files, '.json'))
                .then((files) => {

                    let counter = files.length;
                    let fileList = [];
                    let mediaList = [];

                    for (let file of files) {
                        fileHelper.loadFile(file)
                            .then((data) => {
                                try {
                                    let media = JSON.parse(data);
                                    if (media && media.director) {
                                        fileList.push(file);
                                        mediaList.push(media);
                                    }
                                } catch (e) {
                                    console.error(e);
                                }

                                if (--counter == 0)
                                    this.setState({ fileList: fileList, mediaList: mediaList });
                            })
                    }
                })

        });

        Ipc.onMeunMediaListSelectPath(() => {
            Ipc.showPathDialog();
        });

        Ipc.onMenuMediaListNewMedia(() => {
            console.log('onMenuMediaListNewMedia');
        });

        Ipc.onMenuMediaItemRename(() => {
            console.log('onMenuMediaItemRename');
        });

        Ipc.onMenuMediaItemDelete(() => {
            console.log('onMenuMediaItemDelete');
        });
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

    onLoadMedia(callback) {
        this.loadMedia = callback
    }

    saveMedia(name, media) {
        console.log(media, '.......');
        this.fileHelper.saveFile(name, media)
            .then(() => console.log('save success!'));
    }

    /**
     * UI綁定
     */
    handleLaunchClick() {
        console.log('handleLaunchClick()');
        Ipc.togglePlayer();
    }

    handleMediaListOptionClick() {
        Ipc.showMenuMediaListOption();
    }

    handleMediaItemContextMenu(index) {
        Ipc.showMenuMediaItem();
        this.setState({ contextMenuTargetMedia: index });
    }

    handleMediaItemClick(index) {
        console.log('handleMediaItemClick()', index);
        let filename = this.state.fileList[index];
        let media = this.state.mediaList[index];

        this.setState({ selectedMedia: index, director: media.director });

        // 重點: 確保loadMedia比較晚被呼叫，解決變換Director時遇到的問題。
        setImmediate(() => {
            this.loadMedia(filename, media);
        })

    }

    render() {

        // Hot require Director components
        let Director = require('../directors/' + this.state.director + '/index.jsx').default
        if (!Director) throw new Error('Director Load Error');

        // Media List
        let mediaList = this.state.mediaList.map((media, i) => {
            let mediaName = FileHelper.getFilename(this.state.fileList[i]);
            let title = mediaName + ` (${media.director})`;
            return (
                <MediaItem key={i} title={title}
                    selected={i == this.state.selectedMedia}
                    editing={false}
                    onClick={(e) => this.handleMediaItemClick(i)}
                    onContextMenu={(e) => this.handleMediaItemContextMenu(i)}
                />
            )
        });


        // pathStr
        let pathStr = this.state.path || 'null';
        if (pathStr.length > 20)
            pathStr = pathStr.substring(0, 20) + '...';

        // mediaName
        let selectedFile = this.state.fileList[this.state.selectedMedia];
        let mediaName = selectedFile ? FileHelper.getFilename(selectedFile) : 'Media Name';

        return (
            <div style={GridStyle.container}>

                {/* Top */}
                <div style={GridStyle.top}>

                    {/* Media List Title */}
                    <div style={GridStyle.topL}>
                        <div style={MainStyle.mediaListTitle}>
                            Media List
                            <span style={MainStyle.mediaFolderPath}>({pathStr})</span>
                        </div>
                        <div style={MainStyle.folderBtnRow}>
                            <button style={MainStyle.folderBtn} onClick={this.handleMediaListOptionClick}>...</button>
                        </div>
                    </div>

                    {/* Director Title */}
                    <div style={GridStyle.topR}>
                        <div style={MainStyle.mediaNameTitle}>
                            {mediaName}
                        </div>
                        <div style={MainStyle.topBtnRow}>
                            <button style={MainStyle.topBtn}>Fn1</button>
                            <button style={MainStyle.topBtn}>Fn2</button>
                            <button style={MainStyle.topBtn}>Fn3</button>
                            <button style={MainStyle.topBtn}>Fn4</button>
                        </div>
                    </div>
                </div>

                {/* Center */}
                <div style={GridStyle.center}>

                    {/* Media List */}
                    <div style={GridStyle.centerL}>
                        <ul className="scroller" style={MainStyle.mediaList}>
                            {mediaList}
                        </ul>
                    </div>

                    {/* Director */}
                    <div style={GridStyle.centerR}>
                        <Director selectTemplate={this.selectTemplate}
                            updateContent={this.updateContent}
                            onLoadMedia={this.onLoadMedia}
                            saveMedia={this.saveMedia} />
                        {/* 尚未選擇內容 */}
                    </div>
                </div>

                {/* Bottom */}
                <div style={GridStyle.bottom}>

                    {/* Launch Button */}
                    <div style={GridStyle.bottomL}>
                        <button style={MainStyle.launchBtn} onClick={this.handleLaunchClick}>Launch</button>
                    </div>

                    {/* Bottom Row */}
                    <div style={GridStyle.bottomR}>
                        <button style={MainStyle.fnBtn}>Fn1</button>
                        <button style={MainStyle.fnBtn}>Fn2</button>
                        <button style={MainStyle.fnBtn}>Fn3</button>
                        <button style={MainStyle.fnBtn}>Fn4</button>
                        <button style={MainStyle.fnBtn}>Fn5</button>
                    </div>
                </div>
            </div >
        )
    }
}