import React from 'react';

export default class SingleSongLyrics extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        /* Content */
        let lyric1 = this.props.content.lyric1 || "　"; // 解決空白內容被隱藏的問題
        let lyric2 = this.props.content.lyric2 || "　";

        /* Attribute */
        let attribute = this.props.attribute || {};
        let verticalOffset = attribute.verticalOffset || 5;
        let lyric2Visible = attribute.lyric2Visible || (attribute.lyric2Visible == false ? false : true);
        let lyric1FontSize = attribute.lyric1FontSize || 36;
        let lyric2FontSize = attribute.lyric2FontSize || 20;
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
            // textShadow: `0 0 ${fontShadowLevel}px ${fontShadowColor}`,
            // WebkitTextStroke: `${fontShadowLevel * 0.1}px ${fontShadowColor}`,
        }

        let lyric1Style = {
            ...Styles.content1,
            margin: `auto 0px ${lyric2Visible ? '0px' : verticalOffset + '%'} 0px`,
            fontSize: `${lyric1FontSize}px`,
            // lineHeight: `${lyric1FontSize * 1.3}px`,
        }

        let lyric2Style = {
            ...Styles.content2,
            margin: `0px 0px ${verticalOffset}% 0px`,
            fontSize: `${lyric2FontSize}px`,
            // lineHeight: `${lyric1FontSize * 1.1}px`,
            display: lyric2Visible ? '' : 'None',
        }

        return (
            <div style={containerStyle}>
                <div style={lyric1Style}>{lyric1}</div>
                <div style={lyric2Style}>{lyric2}</div>
            </div>
        )
    }
}


const Styles = {
    container: {
        width: '100%',
        height: '100%',
        // background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',

        // color: '#FFFFFF',
        // textShadow: textShadow,
        fontFamily: 'NotoSansTC, Roboto, 微軟正黑體',
    },
    content1: {
        // margin: 'auto 0px auto 0px',
        display: 'flex',
        flexDirection: 'column',
        // fontSize: '7.2em',
        textAlign: 'center',
        // lineHeight: '1.5em',
        wordSpacing: '0.2em',
        whiteSpace: 'nowrap',
    },
    content2: {
        // margin: '0px 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        // fontSize: '5.8em',
        textAlign: 'center',
        // lineHeight: '1em',
        whiteSpace: 'nowrap',
    }
}