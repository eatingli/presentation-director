import React from 'react';
import RowItem from './RowItem.jsx'
import SongParser from './lib/song-parser.jsx';

class Mode {
    static CTRL = 0;
    static EDIT = 1;
}

export default class SingleSong extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // 載入的資料
            filename: '',
            media: {},

            // 兩個欄位
            rawTitle: '',
            rawLyrics: '',

            editTitle: '',
            editLyrics: '',

            // 解析過的資料
            song: {},

            // Mode
            mode: Mode.CTRL,

            selectedRow: -1,
        }

        this.editSong = this.editSong.bind(this);
        this.saveSong = this.saveSong.bind(this);

        this.editUI = this.editUI.bind(this);
        this.ctrlUI = this.ctrlUI.bind(this);

        this.multiTemplate = this.multiTemplate.bind(this);
        this.blackTemplate = this.blackTemplate.bind(this);
    }

    componentDidMount() {

        /**
         * Load song
         */
        this.props.onLoadMedia((filename, media) => {

            console.log('onLoadMedia()');
            this.setState({
                // Refreash
                mode: Mode.CTRL,
                selectedRow: -1,

                filename: filename,
                media: media,
                rawTitle: media.data.title || '',
                rawLyrics: media.data.lyrics || '',
            });
            setImmediate(() => {
                this.editSong();
            });
        });
    }

    editSong() {
        let parser = new SongParser();
        parser.parseTitle(this.state.rawTitle);
        parser.parseLyrics(this.state.rawLyrics);
        this.setState({ song: parser.getSong() });
    }

    saveSong() {

        console.log('saveSong()');

        if (!this.state.filename || this.state.filename.length == 0) throw new Error('filename error');

        let media = this.state.media;
        media.data.title = this.state.rawTitle;
        media.data.lyrics = this.state.rawLyrics;

        this.props.saveMedia(this.state.filename, JSON.stringify(media));
    }

    multiTemplate(part) {
        console.log(part);
        this.props.selectTemplate('MultiSong');
        this.props.updateContent({
            title: this.state.song.title,
            content1: part[0] ? part[0].content : '',
            content2: part[1] ? part[1].content : '',
            content3: part[2] ? part[2].content : '',
            content4: part[3] ? part[3].content : '',
        })
    }

    blackTemplate() {
        this.props.selectTemplate('Color');
        this.props.updateContent({
            color: '#000000'
        });
    }

    handleEdit() {
        this.setState({
            mode: Mode.EDIT,
            editTitle: this.state.rawTitle,
            editLyrics: this.state.rawLyrics,
        })
    }

    handleBack() {
        this.setState({ mode: Mode.CTRL })
    }

    handleSave() {
        this.setState({
            mode: Mode.CTRL,
            rawTitle: this.state.editTitle,
            rawLyrics: this.state.editLyrics,
        })
        setImmediate(() => {
            this.editSong();
            this.saveSong();
        });
    }

    /**
     * 編輯介面
     */
    editUI() {
        return (
            <div className="scroller" style={Styles.container}>
                {/* 標題 */}
                <input type="text" style={Styles.textTitle} value={this.state.editTitle} placeholder="標題"
                    onChange={(e) => this.setState({ editTitle: e.target.value })} />
                <br />

                {/* 歌詞 */}
                <textarea className="scroller" style={Styles.textLyrics} rows="27" value={this.state.editLyrics} placeholder="歌詞"
                    onChange={(e) => this.setState({ editLyrics: e.target.value })}></textarea>
                <br />

                {/* 編輯按鈕 */}
                <button style={Styles.btn} onClick={this.handleBack.bind(this)}>Back</button>
                <button style={Styles.btn} onClick={this.handleSave.bind(this)}>Save</button>

            </div>
        )
    }

    /**
     * 控制介面
     */
    ctrlUI() {

        let song = this.state.song;
        let title, parts;

        // Check
        if (song.title && song.parts && song.parts.length > 0) {

            title = (
                <RowItem
                    text={`[ ${song.title} ]`}
                    selected={this.state.selectedRow == 0}
                    onClick={() => {
                        {/* this.multiTemplate(song.parts[0]); */ }
                        this.setState({ selectedRow: 0 });
                    }} />
            )

            let selectIndex = 0;
            let key = 0;

            parts = song.parts.map((part, i) => {

                // Part
                let p = part.map((lyric) => {
                    let index = selectIndex;
                    return (
                        <RowItem
                            key={key++}
                            text={`${lyric.content} ${lyric.tag ? `[${lyric.tag}]` : ''}`}
                            selected={this.state.selectedRow == index}
                            onClick={() => {
                                this.multiTemplate(part);
                                this.setState({ selectedRow: index });
                            }} />
                    )
                })
                selectIndex++;

                let index = selectIndex;
                // 空白
                p.push((
                    <RowItem
                        key={key++}
                        text=""
                        selected={this.state.selectedRow == index}
                        onClick={() => {
                            this.blackTemplate();
                            this.setState({ selectedRow: index });
                        }} />
                ));
                selectIndex++;

                return p;
            })
        }


        return (
            <div className="scroller" style={Styles.container}>
                <ul style={Styles.lyricList}>
                    {title}
                    {parts}
                </ul>
                <br />
                <button style={Styles.btn} onClick={this.handleEdit.bind(this)}>Edit</button>
            </div >
        )
    }

    render() {
        switch (this.state.mode) {
            case Mode.EDIT:
                return this.editUI();
            case Mode.CTRL:
                return this.ctrlUI();
            default:
                return this.ctrlUI();
        }
    }
}


const Styles = {
    container: {
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
    },
    lyricList: {
        minWidth: '300px',
        display: 'inline-block'
    },
    textTitle: {
        width: '441px',
        margin: '5px 0 5px 5px',
        padding: '0 0 0 8px',
        lineHeight: '23px',
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid #1565C0',
    },
    textLyrics: {
        width: '600px',
        margin: '5px 0 5px 5px',
        padding: '5px 0 5px 8px',
        lineHeight: '18px',
        resize: 'none',
        overflowY: 'scroll',
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid #1565C0',
    },
    btn: {
        width: '100px',
        margin: '0 10px 10px 10px',
        color: '#ffffff',
        backgroundColor: '#434343',
        border: '0',
        fontSize: '17px',
        letterSpacing: '1px',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    },
}
