import React from 'react';

export default class MediaItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            focus: false,
        }
    }

    handleMouseEnter() {
        this.setState({ focus: true })
    }

    handleMouseLeave() {
        this.setState({ focus: false })
    }

    render() {
        // let btn = this.state.focus ? (
        //     <div style={Style.btnRow}>
        //         <button style={Style.btnEdit} onClick={this.props.handleEdit}>R</button>
        //         <button style={Style.btnDelete} onClick={this.props.handleDelete}>X</button>
        //     </div>
        // ) : (null);

        let bgStyle = this.state.focus ? Style.focus : {};
        if (this.props.selected) bgStyle = Style.selected;

        return (
            <li style={{ ...Style.item, ...bgStyle }}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}>
                {this.props.title}
                {/* {btn} */}
            </li>
        );
    }
}



const Style = {
    item: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        padding: '0px 0px 0px 18px',
        lineHeight: '33px',
        fontSize: '17px',
    },
    focus: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)'
    },
    selected: {
        backgroundColor: 'rgba(255, 255, 255, 0.11)',
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
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