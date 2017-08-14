import React, { PropTypes } from 'react';

export default class RowItem extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        focus: false,
    }

    static defaultProps = {
        selected: false,
    }
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    }

    handleMouseEnter() {
        this.setState({ focus: true })
    }

    handleMouseLeave() {
        this.setState({ focus: false })
    }

    render() {

        let bgStyle = this.state.focus ? Styles.focus : {};
        if (this.props.selected) bgStyle = Styles.selected;
        return (
            <li style={{ ...Styles.row, ...bgStyle }}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}
                onClick={this.props.onClick}>
                {this.props.text}
            </li>
        )
    }
}

const Styles = {
    row: {
        cursor: 'pointer',
        // lineHeight: '24px',
    },
    focus: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)'
    },
    selected: {
        backgroundColor: 'rgba(255, 255, 255, 0.11)',
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
    },
}