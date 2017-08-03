import React from 'react';
import SingleSongParser from '../service/single-song-parser.js';

export default class SingleSong extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rawTitle: '',
            rawDescription: '',
            rawLyrics: '',
            song: {},
        }

        this.editSong = this.editSong.bind(this);
    }

    editSong() {
        let parser = new SingleSongParser();
        parser.parseTitle(this.state.rawTitle);
        parser.parseDescription(this.state.rawDescription);
        parser.parseLyrics(this.state.rawLyrics);
        this.setState({ song: parser.getSong() });
        console.log(parser.getSong());
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
                    <textarea rows="40" cols="70" value={this.state.rawLyrics} placeholder="歌詞"
                        onChange={(e) => this.setState({ rawLyrics: e.target.value })}></textarea>
                    <br />

                    {/* 編輯按鈕 */}
                    <button onClick={this.editSong}>編輯</button>
                </div>

                {/* 控制介面 */}
                <div>
                    <ul>
                        <li onClick={() => {
                            this.props.selectTemplate('Template1')
                            this.props.updateContent({ A: this.state.song.title1 })
                        }}>首頁：{this.state.song.title1} {this.state.song.title2}</li>
                        {
                            this.state.song.lyrics &&
                            this.state.song.lyrics.map((lyric, i) => (
                                <li key={i} onClick={() => {
                                    this.props.selectTemplate('Template1')
                                    this.props.updateContent({ A: lyric.content1 })
                                }}>{lyric.content1} {lyric.tag ? `[${lyric.tag}]` : ''}</li>
                            ))
                        }

                    </ul>
                </div>

            </div>
        )
    }
}

