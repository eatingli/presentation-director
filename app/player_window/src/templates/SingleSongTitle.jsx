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


const Styles = {
    container: {
        width: '100%',
        height: '100%',
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',

        fontSize: '4em',
        color: '#FFFFFF',
        textShadow: '0 0 7px #6060ff, 0 0 7px #6060ff, 0 0 7px #6060ff',
        fontFamily: 'NotoSansTC, Roboto',
    },
    title1: {
        textAlign: 'right',
        margin: '20px 20px 0px 8px',
        padding: '0',
        // fontWeight: '700',
        letterSpacing: '3px',
        lineHeight: '1em',
    },
    title2: {
        textAlign: 'right',
        margin: '0px 30px 0px 8px',
        padding: '0',
        textDecoration: 'underline',
        lineHeight: '1em',
    },
    description: {
        margin: 'auto 0px 60px 0px',
        display: 'flex',
        flexDirection: 'column',
    },
    descriptionLine: {
        textAlign: 'center',
        margin: '0',
        padding: '0',
    }
}