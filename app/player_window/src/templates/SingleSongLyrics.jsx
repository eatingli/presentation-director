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

const Styles = {
    container: {
        width: '100%',
        height: '100%',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',

        color: '#FFFFFF',
        textShadow: '0 0 7px #6060ff, 0 0 7px #6060ff, 0 0 7px #6060ff',
        fontFamily: 'NotoSansTC, Roboto',
    },
    content1: {
        margin: 'auto 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '5em',
        textAlign: 'center',
        lineHeight: '1.5em',
    },
    content2: {
        margin: '0px 0px 80px 0px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: '3.3em',
        textAlign: 'center',
        lineHeight: '1em',
    }
}