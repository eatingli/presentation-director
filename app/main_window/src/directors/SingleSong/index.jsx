import React from 'react';
import RowItem from './RowItem.jsx'
import SingleSongParser from './lib/song-parser.jsx';

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

            // 三個欄位
            rawTitle: '',
            rawDescription: '',
            rawLyrics: '',

            editTitle: '',
            editDescription: '',
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

        this.titleTemplate = this.titleTemplate.bind(this);
        this.lyricsTemplate = this.lyricsTemplate.bind(this);

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
                rawDescription: media.data.description || '',
                rawLyrics: media.data.lyrics || '',
            });
            setImmediate(() => {
                this.editSong();
            });
        });
    }

    editSong() {
        let parser = new SingleSongParser();
        parser.parseTitle(this.state.rawTitle);
        parser.parseDescription(this.state.rawDescription);
        parser.parseLyrics(this.state.rawLyrics);
        this.setState({ song: parser.getSong() });
    }

    saveSong() {

        console.log('saveSong()');

        if (!this.state.filename || this.state.filename.length == 0) throw new Error('filename error');

        let media = this.state.media;
        media.data.title = this.state.rawTitle;
        media.data.description = this.state.rawDescription;
        media.data.lyrics = this.state.rawLyrics;

        this.props.saveMedia(this.state.filename, JSON.stringify(media));
    }

    titleTemplate() {
        this.props.selectTemplate('SingleSongTitle');
        this.props.updateContent({
            title1: this.state.song.title1,
            title2: this.state.song.title2,
            description1: this.state.song.description1,
            description2: this.state.song.description2
        })
    }

    lyricsTemplate(lyric) {
        this.props.selectTemplate('SingleSongLyrics')
        this.props.updateContent({
            content1: lyric.content1,
            content2: lyric.content2
        })
    }

    handleEdit() {
        this.setState({
            mode: Mode.EDIT,
            editTitle: this.state.rawTitle,
            editDescription: this.state.rawDescription,
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
            rawDescription: this.state.editDescription,
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

                {/* 描述 */}
                <textarea style={Styles.textDescription} rows="2" value={this.state.editDescription} placeholder="描述"
                    onChange={(e) => {
                        if (e.target.value.split('\n').length <= 2)
                            this.setState({ editDescription: e.target.value })
                    }}></textarea>
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
        let title, lyrics;

        // Check
        if (song.title1 && song.lyrics.length > 0) {
            title = (
                <RowItem
                    text={`[ ${song.title1} ]`}
                    selected={this.state.selectedRow == 0}
                    onClick={() => {
                        this.titleTemplate();
                        this.setState({ selectedRow: 0 });
                    }} />
            )

            lyrics = song.lyrics.map((lyric, i) => (
                <RowItem
                    key={i}
                    text={`${lyric.content1} ${lyric.tag ? `[${lyric.tag}]` : ''}`}
                    selected={this.state.selectedRow == i + 1}
                    onClick={() => {
                        this.lyricsTemplate(lyric);
                        this.setState({ selectedRow: i + 1 });
                    }} />
            ))
        }


        return (
            <div className="scroller" style={Styles.container}>
                <ul style={Styles.lyricList}>
                    {title}
                    {lyrics}
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
    textDescription: {
        width: '440px',
        margin: '5px 0 5px 5px',
        padding: '0 0 0 8px',
        lineHeight: '23px',
        resize: 'none',
        overflowY: 'hidden',
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid #1565C0',
    },
    textLyrics: {
        width: '800px',
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
