import React from 'react';

const Test2 = (props) => (
    <div>
        <ul>
            <li onClick={() => {
                props.selectTemplate('Template1')
                props.updateContent({ A: '第一句' })
            }}>第一句</li>
            <li onClick={() => {
                props.selectTemplate('Template2')
                props.updateContent({ A: '第二句', B: '第三句' })
            }}>二、三句</li>
            <li onClick={() => {
                props.selectTemplate('Template2')
                props.updateContent({ A: '第四句', B: '第五句' })
            }}>四、五句</li>
            <li onClick={() => {
                props.selectTemplate('Template2')
                props.updateContent({ A: '第六句', B: '第七句' })
            }}>六、七句</li>
        </ul>
    </div>
)

export default Test2