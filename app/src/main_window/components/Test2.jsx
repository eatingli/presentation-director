import React from 'react';

const Test2 = (props) => (
    <div>
        <button onClick={() => {
            let nowTime = new Date().getTime();
            props.selectTemplate('Test2');
            props.updateContent('' + nowTime);
        }}>
            Update
        </button>
    </div>
)

export default Test2