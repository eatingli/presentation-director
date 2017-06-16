import React from 'react';

const Test2 = (props) => (
    <div>
        <ul>
            <li onClick={() => {
                props.selectTemplate('Template2')
                props.updateContent({ A: '第一句' })
            }}>第一句</li>
            <li onClick={() => {
                props.selectTemplate('Template2')
                props.updateContent({ A: '第二句' })
            }}>第二句</li>
            <li onClick={() => {
                props.selectTemplate('Template3')
                props.updateContent({ A: '第三句', B: '第四句' })
            }}>三、四句</li>
            <li onClick={() => {
                props.selectTemplate('Template3')
                props.updateContent({ A: '第五句', B: '第六句' })
            }}>五、六句</li>
        </ul>
    </div>
)

export default Test2