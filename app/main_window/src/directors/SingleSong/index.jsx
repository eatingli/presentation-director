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
                <input type="text" value={this.state.editTitle} placeholder="標題"
                    onChange={(e) => this.setState({ editTitle: e.target.value })} />
                <br />

                {/* 描述 */}
                <textarea rows="2" cols="90" value={this.state.editDescription} placeholder="描述"
                    onChange={(e) => this.setState({ editDescription: e.target.value })}></textarea>
                <br />

                {/* 歌詞 */}
                <textarea rows="32" cols="90" value={this.state.editLyrics} placeholder="歌詞"
                    onChange={(e) => this.setState({ editLyrics: e.target.value })}></textarea>
                <br />

                {/* 編輯按鈕 */}
                <button onClick={this.handleBack.bind(this)}>Back</button>
                <button onClick={this.handleSave.bind(this)}>Save</button>

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
                <ul>
                    {title}
                    {lyrics}
                </ul>
                <button onClick={this.handleEdit.bind(this)}>Edit</button>
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
        padding: '0 30px 0 0',
    },
}
