import * as React from 'react';
import { EditFormCommonProps } from './type';

export default class UnSupportConfigForm extends React.Component<EditFormCommonProps> {
    render() {
        return (
            <div>
                该组件暂不支持编辑
            </div>
        );
    }
}