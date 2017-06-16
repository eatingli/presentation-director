import React from 'react';

const Test1 = (props) => (
    <div>
        <button onClick={() => {
            let nowTime = new Date().getTime();
            props.selectTemplate('Test1');
            props.updateContent('' + nowTime);
        }}>
            Update
        </button>
    </div>
)

export default Test1