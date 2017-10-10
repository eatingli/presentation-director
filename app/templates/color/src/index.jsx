import React from 'react';



const Template = (props) => {
    let color = props.content.color || '#000000';
    return (
        <div style={{ ...Styles.container, background: color }}>
        </div>
    )
}

const Styles = {
    container: {
        width: '100%',
        height: '100%',
    },
}

export default Template