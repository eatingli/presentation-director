import React from 'react';

export default class SingleSongLyrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        /* Content */
        let title = this.props.content.title || "　";
        let lyrics = this.props.content.lyrics || [];

        /* Attribute */
        let attribute = this.props.attribute || {};
        let titleFontSize = attribute.titleFontSize || 60;
        let rowFontSize = attribute.rowFontSize || 50;
        let rowLineHeight = attribute.rowLineHeight || 150;
        let backgroundColor = attribute.backgroundColor || '#000000'
        let fontColor = attribute.fontColor || '#FFFFFF';
        let fontShadowLevel = attribute.fontShadowLevel || 20;
        let fontShadowColor = attribute.fontShadowColor || '#3030aa';

        /* Check Attribute */

        // textShadow
        let textShadow = [];
        for (let i = 0; i < fontShadowLevel; i++)
            textShadow.push(`0 0 ${fontShadowLevel * 0.6}px ${fontShadowColor}`);
        textShadow = textShadow.join(',');

        /* Style */
        let containerStyle = {
            ...Styles.container,
            background: backgroundColor,
            color: fontColor,
            textShadow: textShadow,
        }

        let titleStyle = {
            ...Styles.title,
            fontSize: `${titleFontSize}px`
        }

        let rowStyle = {
            ...Styles.row,
            fontSize: `${rowFontSize}px`,
            lineHeight: `${rowLineHeight}%`
        }

        return (
            <div style={containerStyle}>

                {/* Title */}
                <div style={titleStyle}>
                    {title}
                </div>

                {/* Content */}
                <div style={Styles.content}>
                    {lyrics.map((lyric, i) => (
                        <div style={rowStyle} key={i}>{lyric}</div>
                    ))}
                </div>
            </div >
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
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'NotoSansTC, Roboto, 微軟正黑體',
        overflow: 'hidden',
    },
    title: {
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
        textAlign: 'center',
        wordSpacing: '0.2em',
        whiteSpace: 'nowrap',
    },
}