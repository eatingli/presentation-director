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
            mediaList: [],  // 媒體清單(解析過後)
            selectedMedia: null,
            contextMenuTargetMedia: null,
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

        this.checkPath = this.checkPath.bind(this);
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
                    if (this.checkPath())
                        this.updateFileList();
                    else
                        alert('Invalid Path')
                    break;
                case Const.MENU_MEDIA_LIST_.SINGLE_SONG:
                    this.newDirector = 'SingleSong';
                    if (this.checkPath())
                        Ipc.showNewMediaDialog();
                    else
                        alert('Invalid Path')
                    break;
                case Const.MENU_MEDIA_LIST_.MULTI_SONG:
                    this.newDirector = 'MultiSong';
                    if (this.checkPath())
                        Ipc.showNewMediaDialog();
                    else
                        alert('Invalid Path')
                    break;
                case Const.MENU_MEDIA_LIST_.BIBLE_STUDY:
                    this.newDirector = 'bible-study';
                    if (this.checkPath())
                        Ipc.showNewMediaDialog();
                    else
                        alert('Invalid Path')
                    break;
            }
        })

        Ipc.onMenuMediaItem((flag) => {
            switch (flag) {
                case Const.MENU_MEDIA_ITEM_.RENAME:
                    Ipc.showMediaRenameDialog();
                    break;
                case Const.MENU_MEDIA_ITEM_.DELETE:
                    Ipc.showMediaDeleteDialog();
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
            let media = this.state.contextMenuTargetMedia;
            let oldFile = media.filename;
            let newFile = Path.basename(file);
            if (!oldFile || !newFile || oldFile === newFile) return;

            this.fileHelper.saveFile(newFile, JSON.stringify(media.file))
                .then(() => this.fileHelper.deleteFile(oldFile))
                .then(() => this.updateFileList())
                .catch((e) => { console.error(e); })
        })

        Ipc.onMediaDelete((isDelete) => {
            if (!isDelete) return;
            let filename = this.state.contextMenuTargetMedia.filename;
            this.fileHelper.deleteFile(filename)
                .then(() => {
                    this.updateFileList();
                })
        });
    }

    /**
     * 確認已選擇路徑，且路徑有效
     * 未完成
     */
    checkPath() {
        return this.state.path.length > 0;
    }

    updateFileList() {

        let fileHelper = this.fileHelper;

        fileHelper.updateFileList()
            .then((files) => FileHelper.extnameFilter(files, '.json'))
            .then((files) => {

                let counter = files.length;
                let mediaList = [];
                let err = [];

                let loopLoad = () => {
                    let filename = files[--counter]
                    fileHelper.loadFile(filename)
                        .then((data) => {

                            // 解析檔案
                            let file = JSON.parse(data);
                            if (file && file.director) {
                                mediaList.push({
                                    filename: filename,
                                    file: file
                                });
                            }
                        })
                        .catch((e) => {
                            console.error(e)
                            err.push(filename);
                        })
                        .then(() => {
                            // 終止條件檢查
                            if (counter == 0) {
                                this.setState({
                                    mediaList: mediaList,
                                    selectedMedia: null,
                                    director: '',
                                });
                                if (err.length > 0) alert('Media Loading Failed : \n ' + err.join('\n '))
                            } else {
                                // 繼續遞迴
                                loopLoad();
                            }
                        })
                }
                loopLoad = loopLoad.bind(this);

                if (counter > 0) loopLoad();
                else {
                    this.setState({
                        mediaList: [],
                        selectedMedia: null,
                        director: '',
                    });
                }
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

    handleMediaItemContextMenu(media) {
        Ipc.showMenuMediaItem();
        this.setState({ contextMenuTargetMedia: media });
    }

    handleMediaItemClick(media) {
        let filename = media.filename;

        this.setState({ selectedMedia: media, director: media.file.director });

        // 重點: 確保loadMedia比較晚被呼叫，解決變換Director時遇到的問題。
        setImmediate(() => {
            this.loadMedia(filename, media.file);
        })

    }

    render() {

        // Hot require Director components
        let Director = null;
        if (this.state.director) {
            Director = require(`../../../directors/${this.state.director}/src/index.jsx`).default
            if (!Director) throw new Error('Director Load Error');
        }

        // Media List，根據類別插入分類的標題
        let mediaList = [];
        let tempMediaList = this.state.mediaList.slice();

        while (tempMediaList.length > 0) {

            let kindList = []
            let director = tempMediaList[0].file.director;

            // 尋找同類別的媒體
            tempMediaList.forEach((media, index) => {
                if (media.file.director === director) kindList.push(media);
            })

            // 從暫存清單中移除
            kindList.forEach((media) => {
                tempMediaList.splice(tempMediaList.indexOf(media), 1);
            })

            // 重新排序後
            kindList.sort((a, b) => {
                if (a.filename > b.filename) return 1;
                else if (a.filename < b.filename) return -1;
                else return 0;
            })

            // 加到媒體清單中，並放上分類標題
            mediaList.push({ kindTitle: director });
            mediaList = mediaList.concat(kindList);

        }

        // 轉換
        mediaList = mediaList.map((item, i) => {

            // 標題
            if (item.kindTitle) return (
                <li key={i} style={MainStyle.mediaListKindTitle}> # {item.kindTitle}</li>
            )

            // 內容
            let media = item;
            let mediaName = FileHelper.getFilename(media.filename);
            let title = mediaName;
            return (
                <MediaItem key={i} title={title}
                    selected={media == this.state.selectedMedia}
                    editing={false}
                    onClick={(e) => this.handleMediaItemClick(media)}
                    onContextMenu={(e) => this.handleMediaItemContextMenu(media)}
                />
            )
        });


        // pathStr
        let pathStr = this.state.path || 'null';
        if (pathStr.length > 20)
            pathStr = pathStr.substring(0, 20) + '...';

        // mediaName
        let selectedMedia = this.state.selectedMedia;
        let mediaName = selectedMedia ? FileHelper.getFilename(selectedMedia.filename) : 'Media Name';

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
                            {/* 提示 */}
                            {this.state.path ? null :
                                (<li style={MainStyle.mediaListPrompt}>Click ... to Select Path</li>)}
                            {this.state.path && this.state.mediaList.length == 0 ?
                                (<li style={MainStyle.mediaListPrompt}>Click ... to Add Media</li>) : null}

                            {/* Media List */}
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