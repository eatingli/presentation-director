import React from 'react';

export default class SingleSongTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        /* Content */
        let title1 = this.props.content.title1 || "　"; // 解決空白內容被隱藏的問題
        let title2 = this.props.content.title2 || "　";
        let descriptions = this.props.content.descriptions || [];

        /* Attribute */
        let attribute = this.props.attribute || {};
        let title1FontSize = attribute.title1FontSize || 40;
        let title2FontSize = attribute.title2FontSize || 28;
        let descriptionFontSize = attribute.descriptionFontSize || 26;
        let backgroundColor = attribute.backgroundColor || '#000000'
        let fontColor = attribute.fontColor || '#FFFFFF';
        let fontShadowLevel = attribute.fontShadowLevel || 20;
        let fontShadowColor = attribute.fontShadowColor || '#3030aa';


        console.log('123', title1);
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

        let title1Style = {
            ...Styles.title1,
            fontSize: `${title1FontSize}px`,
        }

        let title2Style = {
            ...Styles.title2,
            fontSize: `${title2FontSize}px`,
        }

        let descriptionLineStyle = {
            ...Styles.descriptionLine,
            fontSize: `${descriptionFontSize}px`,
        }

        let descriptionLine = [];

        return (
            <div style={containerStyle}>

                {/* Title */}
                <p style={title1Style}>{title1}</p>
                <p style={title2Style}>{title2}</p>

                {/* Description */}
                <div style={Styles.description}>
                    {descriptions.map((description, i) => (<p style={descriptionLineStyle} key={i}>{description}</p>))}
                </div>

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
    title1: {
        textAlign: 'right',
        margin: '30px 30px 0px 0px',
        padding: '0',
        // fontWeight: '700',
        letterSpacing: '3px',
        lineHeight: '1.1em',
        // fontSize: '5.6em',
        whiteSpace: 'nowrap',
    },
    title2: {
        textAlign: 'right',
        margin: '0px 30px 0px 0px',
        padding: '0',
        // textDecoration: 'underline',
        lineHeight: '1.1em',
        // fontSize: '5.0em',
        whiteSpace: 'nowrap',
    },
    description: {
        margin: 'auto 0px 40px 0px',
        display: 'flex',
        flexDirection: 'column',
    },
    descriptionLine: {
        textAlign: 'center',
        margin: '0',
        padding: '0',
        wordSpacing: '0.2em',
        // fontSize: '4.4em',
        whiteSpace: 'nowrap',
    }
}