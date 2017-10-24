import React from 'react';

export default class SingleSongLyrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let lyric1 = this.props.content.lyric1;
        let lyric2 = this.props.content.lyric2;

        // 解決空白內容被隱藏的問題
        lyric1 = lyric1 ? lyric1 : "　";
        lyric2 = lyric2 ? lyric2 : "　";

        return (
            <div style={Styles.container}>
                <div style={Styles.content1}>{lyric1}</div>
                <div style={Styles.content2}>{lyric2}</div>
            </div>
        )
    }
}

// textShadow
let textShadow = [];
for (let i = 0; i < 20; i++)
    textShadow.push('0 0 12px #3030aa');
textShadow = textShadow.join(',');

const Styles = {
    container: {
        width: '100%',
        height: '100%',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',

        color: '#FFFFFF',
        textShadow: textShadow,
        fontFamily: 'NotoSansTC, 微軟正黑體, Roboto',
    },
    content1: {
        margin: 'auto 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '5.0em',
        textAlign: 'center',
        lineHeight: '1.5em',
        wordSpacing: '0.2em',
        whiteSpace: 'nowrap',
    },
    content2: {
        margin: '0px 0px 70px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '4em',
        textAlign: 'center',
        lineHeight: '1em',
        whiteSpace: 'nowrap',
    }
}