import React from 'react';
import RowItem from './RowItem.jsx'
import SingleSongParser from './lib/song-parser.jsx';

class Mode {
    static CTRL = 0;
    static EDIT = 1;
    static ATTR = 2;
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

            // Attribute
            attribute: {
                // Title
                title1FontSize: 40,
                title2FontSize: 24,
                descriptionFontSize: 26,
                // Lyric
                verticalOffset: 5,
                lyric2Visible: true,
                lyric1FontSize: 36,
                lyric2FontSize: 20,
                // Common
                backgroundColor: '#000000',
                fontColor: '#FFFFFF',
                fontShadowLevel: 20,
                fontShadowColor: '#3030aa',
                ...props.initAttribute
            },

            // Mode
            mode: Mode.CTRL,

            selectedRow: -1,
        }

        this.editSong = this.editSong.bind(this);
        this.saveSong = this.saveSong.bind(this);
        this.setAttribute = this.setAttribute.bind(this);

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
        this.props.selectTemplate('single-song-title');
        this.props.updateContent({
            title1: this.state.song.title1,
            title2: this.state.song.title2,
            descriptions: this.state.song.descriptions,
        })
    }

    lyricsTemplate(lyric) {
        this.props.selectTemplate('single-song-lyrics')
        this.props.updateContent({
            lyric1: lyric.content1,
            lyric2: lyric.content2
        })
    }

    setAttribute(attribute) {
        this.setState({
            attribute: {
                ...this.state.attribute,
                ...attribute
            }
        });
        setImmediate(() => this.props.setAttribute(this.state.attribute));
    }

    handleEdit() {
        this.setState({
            mode: Mode.EDIT,
            editTitle: this.state.rawTitle,
            editDescription: this.state.rawDescription,
            editLyrics: this.state.rawLyrics,
        })
    }

    handleAttr() {
        this.setState({
            mode: Mode.ATTR,
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
                <input type="text" style={Styles.textTitle} value={this.state.editTitle} placeholder="標題 ｜ 子標題"
                    onChange={(e) => this.setState({ editTitle: e.target.value })} />
                <br />

                {/* 描述 */}
                <textarea style={Styles.textDescription} rows="4" value={this.state.editDescription} placeholder="描述"
                    onChange={(e) => { this.setState({ editDescription: e.target.value }) }}>
                </textarea>
                <br />

                {/* 歌詞 */}
                <textarea className="scroller" style={Styles.textLyrics} rows="27" value={this.state.editLyrics} placeholder="歌詞 ｜ 子歌詞 [標記]"
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
                <button style={Styles.btn} onClick={this.handleAttr.bind(this)}>Attr</button>
            </div >
        )
    }

    /**
     * 屬性介面
     */
    attrUI() {
        return (
            <div className="scroller" style={Styles.container}>
                <p>Title:</p>
                Title 1 Font Size
                <input type="range" min="0" max="200" value={this.state.attribute.title1FontSize}
                    onChange={(e) => this.setAttribute({ title1FontSize: e.target.value })} />
                ({this.state.attribute.title1FontSize}px)
                <br />

                Title 2 Font Size
                <input type="range" min="0" max="200" value={this.state.attribute.title2FontSize}
                    onChange={(e) => this.setAttribute({ title2FontSize: e.target.value })} />
                ({this.state.attribute.title2FontSize}px)
                <br />

                Description Font Size
                <input type="range" min="0" max="200" value={this.state.attribute.descriptionFontSize}
                    onChange={(e) => this.setAttribute({ descriptionFontSize: e.target.value })} />
                ({this.state.attribute.descriptionFontSize}px)
                <br />

                <p>Lyric:</p>
                Vertical Offset
                <input type="range" min="0" max="100" value={this.state.attribute.verticalOffset}
                    onChange={(e) => this.setAttribute({ verticalOffset: e.target.value })} />
                ({this.state.attribute.verticalOffset}%)
                <br />

                Lyric 2 Visible
                <input type="checkbox" checked={this.state.attribute.lyric2Visible}
                    onChange={(e) => this.setAttribute({ lyric2Visible: e.target.checked })} />
                <br />

                Lyric 1 Font Size
                <input type="range" min="0" max="200" value={this.state.attribute.lyric1FontSize}
                    onChange={(e) => this.setAttribute({ lyric1FontSize: e.target.value })} />
                ({this.state.attribute.lyric1FontSize}px)
                <br />

                Lyric 2 Font Size
                <input type="range" min="0" max="200" value={this.state.attribute.lyric2FontSize}
                    onChange={(e) => this.setAttribute({ lyric2FontSize: e.target.value })} />
                ({this.state.attribute.lyric2FontSize}px)
                <br />

                <p>Common:</p>
                Background Color
                <input type="color" value={this.state.attribute.backgroundColor}
                    onChange={(e) => { this.setAttribute({ backgroundColor: e.target.value }); console.log(e.target.value) }} />
                <br />
                Font Color
                <input type="color" value={this.state.attribute.fontColor}
                    onChange={(e) => { this.setAttribute({ fontColor: e.target.value }); console.log(e.target.value) }} />
                <br />

                Font Shadow Level
                <input type="range" min="0" max="20" value={this.state.attribute.fontShadowLevel}
                    onChange={(e) => this.setAttribute({ fontShadowLevel: e.target.value })} />
                ({this.state.attribute.fontShadowLevel} lv)
                <br />

                Font Shadow Color
                <input type="color" value={this.state.attribute.fontShadowColor}
                    onChange={(e) => { this.setAttribute({ fontShadowColor: e.target.value }) }} />
                <br />

                <button style={Styles.btn} onClick={this.handleBack.bind(this)}>Back</button>
            </div>
        )
    }

    render() {

        switch (this.state.mode) {
            case Mode.EDIT:
                return this.editUI();
            case Mode.CTRL:
                return this.ctrlUI();
            case Mode.ATTR:
                return this.attrUI();
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
