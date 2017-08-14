import React, { PropTypes } from 'react';

export default class MediaItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        focus: false,
    }

    static defaultProps = {
        selected: false,
        editing: false,
    }
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        editing: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        onContextMenu: PropTypes.func.isRequired,
    }

    handleMouseEnter() {
        this.setState({ focus: true })
    }

    handleMouseLeave() {
        this.setState({ focus: false })
    }

    render() {

        // Background Style
        let bgStyle = this.state.focus ? Style.focus : {};
        if (this.props.selected && !this.props.editing) bgStyle = Style.selected;

        return (
            <li style={{ ...Style.item, ...bgStyle }}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}>
                {
                    this.props.editing ?
                        (<input type="text" style={Style.editing} value={this.props.title} onChange={() => { }} />) :
                        (<div style={Style.showing}>{this.props.title}</div>)
                }
            </li>
        );
    }
}



const Style = {
    item: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        padding: '0',
        lineHeight: '33px',
        fontSize: '17px',
        cursor: 'pointer',
    },
    focus: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)'
    },
    selected: {
        backgroundColor: 'rgba(255, 255, 255, 0.11)',
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
    },
    showing: {
        margin: '0px 0px 0px 18px',
    },
    editing: {
        width: '100%',
        padding: '0 0 0 9px',
        margin: '0 8px 0 8px',
        border: '1px solid #1565C0',
        color: '#ffffff',
        fontFamily: 'Roboto, NotoSansTC, sans-serif',
        fontSize: '17px',
        lineHeight: '33px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',

    },
    btnRow: {
        margin: "0px 0px 0px auto",
    },
    btnEdit: {
        border: 0,
        margin: 'auto',
        backgroundColor: '#212121',
        color: '#ffffff',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    },
    btnDelete: {
        border: 0,
        margin: 'auto',
        backgroundColor: '#212121',
        color: '#ffffff',
        boxShadow: '0 0 3px rgba(0, 0, 0, 0.4)',
    }
}