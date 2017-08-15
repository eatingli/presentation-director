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
            launched: false,

            director: '',
        }

        this.newDirector = ''; // New Media 時的型別

        this.selectTemplate = this.selectTemplate.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.onLoadMedia = this.onLoadMedia.bind(this);
        this.saveMedia = this.saveMedia.bind(this);
        this.fileHelper = null;
        this.loadMedia = () => { };

        // UI 綁定
        this.handleMediaListOptionClick = this.handleMediaListOptionClick.bind(this);
        this.handleMediaItemContextMenu = this.handleMediaItemContextMenu.bind(this);
        this.handleMediaItemClick = this.handleMediaItemClick.bind(this);

        this.updateFileList = this.updateFileList.bind(this);

    }

    componentDidMount() {

        /**
         * IPC 事件
         */
        Ipc.onPlayerOpen(() => {
            console.log('On PLAYER_OPEN');
            this.setState({ launched: true })
        });

        Ipc.onPlayerClose(() => {
            console.log('On PLAYER_CLOSE');
            this.setState({ launched: false })
        });

        Ipc.onMenuMediaList((flag) => {
            switch (flag) {
                case Const.MENU_MEDIA_LIST_.SELECT_PATH:
                    Ipc.showPathDialog();
                    break;
                case Const.MENU_MEDIA_LIST_.REFRESH_PATH:
                    this.updateFileList();
                    break;
                case Const.MENU_MEDIA_LIST_.SINGLE_SONG:
                    this.newDirector = 'SingleSong';
                    Ipc.showNewMediaDialog();
                    break;
                case Const.MENU_MEDIA_LIST_.MULTI_SONG:
                    this.newDirector = 'MultiSong';
                    Ipc.showNewMediaDialog();
                    break;
            }
        })

        Ipc.onMenuMediaItem((flag) => {
            switch (flag) {
                case Const.MENU_MEDIA_ITEM_.RENAME:
                    Ipc.showMediaRenameDialog();
                    break;
                case Const.MENU_MEDIA_ITEM_.DELETE:
                    let filename = this.state.fileList[this.state.contextMenuTargetMedia];
                    this.fileHelper.deleteFile(filename)
                        .then(() => {
                            this.updateFileList();
                        })
                    break;
            }
        })

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

            this.updateFileList();

        });

        Ipc.onNewMedia((file) => {

            let media = {};
            media.director = this.newDirector;
            media.data = {};

            this.fileHelper.saveFile(Path.basename(file), JSON.stringify(media))
                .then(() => this.updateFileList())
                .catch((e) => { console.error(e); })
        })

        Ipc.onMediaRename((file) => {
            let media = this.state.mediaList[this.state.contextMenuTargetMedia];
            let oldFile = this.state.fileList[this.state.contextMenuTargetMedia];
            let newFile = Path.basename(file);
            if (!oldFile || !newFile || oldFile === newFile) return;

            this.fileHelper.saveFile(newFile, JSON.stringify(media))
                .then(() => this.fileHelper.deleteFile(oldFile))
                .then(() => this.updateFileList())
                .catch((e) => { console.error(e); })
        })
    }

    updateFileList() {

        let fileHelper = this.fileHelper;

        fileHelper.updateFileList()
            .then((files) => FileHelper.extnameFilter(files, '.json'))
            .then((files) => {

                let counter = files.length;
                let fileList = [];
                let mediaList = [];

                let loopLoad = () => {
                    let file = files[--counter]
                    fileHelper.loadFile(file)
                        .then((data) => {

                            let media = JSON.parse(data);
                            if (media && media.director) {
                                fileList.push(file);
                                mediaList.push(media);
                            }

                            // 終止條件檢查
                            if (counter == 0) {
                                this.setState({
                                    fileList: fileList,
                                    mediaList: mediaList,

                                    // 重置選擇狀態
                                    selectedMedia: -1,
                                    director: '',
                                });
                            } else {
                                loopLoad();
                            }

                        })
                        .catch((e) => console.error(e))
                }
                loopLoad = loopLoad.bind(this);

                if (counter > 0) loopLoad();
            })
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
        let Director = null;
        if (this.state.director) {
            Director = require('../directors/' + this.state.director + '/index.jsx').default
            if (!Director) throw new Error('Director Load Error');
        }

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
                        {
                            this.state.director ?
                                <Director selectTemplate={this.selectTemplate}
                                    updateContent={this.updateContent}
                                    onLoadMedia={this.onLoadMedia}
                                    saveMedia={this.saveMedia} />
                                :
                                null
                        }
                    </div>
                </div>

                {/* Bottom */}
                <div style={GridStyle.bottom}>

                    {/* Launch Button */}
                    <div style={GridStyle.bottomL}>
                        <button style={this.state.launched ? MainStyle.launchedBtn : MainStyle.launchBtn}
                            onClick={this.handleLaunchClick}>Launch</button>
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