import React from 'react';
import SingleSongParser from '../service/single-song-parser.jsx';

export default class SingleSong extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rawTitle: '',
            rawDescription: '',
            rawLyrics: '',
            song: {},
            filename: '',
        }

        this.editSong = this.editSong.bind(this);
        this.saveSong = this.saveSong.bind(this);

        this.props.onLoadMeaia((name, media) => {
            console.log('onLoadMeaia()');
            this.setState({
                filename: name,
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

        let mediaData = {};
        mediaData.director = 'SingleSong';
        mediaData.data = {
            title: this.state.rawTitle,
            description: this.state.rawDescription,
            lyrics: this.state.rawLyrics,
        }

        console.log('saveSong()');

        if (this.state.filename && this.state.filename.length > 0)
            this.props.saveMedia(this.state.filename, JSON.stringify(mediaData));
    }

    render() {
        return (
            <div>
                {/* 編輯介面 */}
                <div>
                    {/* 標題 */}
                    <input type="text" value={this.state.rawTitle} placeholder="標題"
                        onChange={(e) => this.setState({ rawTitle: e.target.value })} />
                    <br />

                    {/* 描述 */}
                    <textarea rows="2" cols="70" value={this.state.rawDescription} placeholder="描述"
                        onChange={(e) => this.setState({ rawDescription: e.target.value })}></textarea>
                    <br />

                    {/* 歌詞 */}
                    <textarea rows="32" cols="70" value={this.state.rawLyrics} placeholder="歌詞"
                        onChange={(e) => this.setState({ rawLyrics: e.target.value })}></textarea>
                    <br />

                    {/* 編輯按鈕 */}
                    <button onClick={this.editSong}>Edit</button>
                    <button onClick={this.saveSong}>Save</button>
                </div>

                {/* 控制介面 */}
                <div>
                    <h2>Direct Panel</h2>
                    <ul>
                        <li onClick={() => {
                            this.props.selectTemplate('SingleSongTitle')
                            this.props.updateContent({
                                title1: this.state.song.title1,
                                title2: this.state.song.title2,
                                description1: this.state.song.description1,
                                description2: this.state.song.description2
                            })
                        }}>[{this.state.song.title1}]</li>
                        {
                            this.state.song.lyrics &&
                            this.state.song.lyrics.map((lyric, i) => (
                                <li key={i} onClick={() => {
                                    this.props.selectTemplate('SingleSongLyrics')
                                    this.props.updateContent({
                                        content1: lyric.content1,
                                        content2: lyric.content2
                                    })
                                }}>{lyric.content1} {lyric.tag ? `[${lyric.tag}]` : ''}</li>
                            ))
                        }

                    </ul>
                </div>

            </div>
        )
    }
}

