import React from 'react';

export default class SingleSongLyrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let content1 = this.props.content.content1;
        let content2 = this.props.content.content2;
        // 解決空白內容被隱藏的問題
        content1 = content1 ? content1 : "　";
        content2 = content2 ? content2 : "　";
        return (
            <div style={Styles.container}>
                <div style={Styles.content1}>{content1}</div>
                <div style={Styles.content2}>{content2}</div>
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
    },
    content1: {
        margin: 'auto 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '5.0em',
        textAlign: 'center',
        lineHeight: '1.5em',
        wordSpacing: '0.2em',
    },
    content2: {
        margin: '0px 0px 70px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '4em',
        textAlign: 'center',
        lineHeight: '1em',
    }
}