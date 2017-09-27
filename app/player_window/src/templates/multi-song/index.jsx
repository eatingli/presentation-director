import React from 'react';

export default class SingleSongLyrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let title = this.props.content.title || "　";
        let lyric1 = this.props.content.lyric1 || "　";
        let lyric2 = this.props.content.lyric2 || "　";
        let lyric3 = this.props.content.lyric3 || "　";
        let lyric4 = this.props.content.lyric4 || "　";

        return (
            <div style={Styles.container}>
                
                {/* Title */}
                <div style={Styles.title}>
                    {title}
                </div>

                {/* Content */}
                <div style={Styles.content}>
                    <div style={Styles.row}>{lyric1}</div>
                    <div style={Styles.row}>{lyric2}</div>
                    <div style={Styles.row}>{lyric3}</div>
                    <div style={Styles.row}>{lyric4}</div>
                </div>
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

        color: '#FFFFFF',
        textShadow: textShadow,
        fontFamily: 'NotoSansTC, Roboto',
        overflow: 'hidden',
    },
    title: {
        fontSize: '4.5em',
        margin: '30px 30px 0 auto',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    content: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        fontSize: '8em',
        textAlign: 'center',
        lineHeight: '1.5em',
        wordSpacing: '0.2em',
        whiteSpace: 'nowrap',
    },
}