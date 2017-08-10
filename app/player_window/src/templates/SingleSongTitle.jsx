import React from 'react';

export default class SingleSongTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={Styles.container}>

                {/* Title */}
                <p style={Styles.title1}>{this.props.content.title1}</p>
                <p style={Styles.title2}>{this.props.content.title2}</p>

                {/* Description */}
                <div style={Styles.description}>
                    <p style={Styles.descriptionLine}>{this.props.content.description1}</p>
                    <p style={Styles.descriptionLine}>{this.props.content.description2}</p>
                </div>

                {/* Title */}
                {/* <p style={Styles.title1}>直到永遠</p> */}
                {/* <p style={Styles.title2}>abcdefghijklmnopqrstuvwxyz</p> */}

                {/* Description */}
                {/* <div style={Styles.description}>
                    <p style={Styles.descriptionLine}>中譯詞：趙治德/蕭郁芸</p>
                    <p style={Styles.descriptionLine}>演唱：趙治德</p>
                </div> */}
            </div>
        )
    }
}

// textShadow
let textShadow = [];
for (let i = 0; i < 15; i++)
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
        fontFamily: 'NotoSansTC, Roboto',
    },
    title1: {
        textAlign: 'right',
        margin: '30px 30px 0px 0px',
        padding: '0',
        // fontWeight: '700',
        letterSpacing: '3px',
        lineHeight: '1.1em',
        fontSize: '4.0em',
        whiteSpace: 'nowrap',
    },
    title2: {
        textAlign: 'right',
        margin: '0px 30px 0px 0px',
        padding: '0',
        // textDecoration: 'underline',
        lineHeight: '1.1em',
        fontSize: '3.5em',
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
        fontSize: '3.0em',
        whiteSpace: 'nowrap',
    }
}