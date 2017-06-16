import React from 'react';

const Test1 = (props) => (
    <div>
        <ul>
            <li onClick={() => {
                props.selectTemplate('Template1')
                props.updateContent({ A: '第一句' })
            }}>第一句</li>
            <li onClick={() => {
                props.selectTemplate('Template1')
                props.updateContent({ A: '第二句' })
            }}>第二句</li>
            <li onClick={() => {
                props.selectTemplate('Template1')
                props.updateContent({ A: '第三句' })
            }}>第三句</li>
            <li onClick={() => {
                props.selectTemplate('Template1')
                props.updateContent({ A: '第四句' })
            }}>第四句</li>
        </ul>
    </div>
)

export default Test1