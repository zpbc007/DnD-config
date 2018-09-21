import * as React from 'react';
import { FieldCommonProps } from './type';

export default class UnsupportWidget extends React.Component<FieldCommonProps> {
    render() {
        const { format, widget, type } = this.props;
        return (
            <div>不支持的组件 type: {type || ''}, format: {format || ''}, widget: {widget || ''}</div>
        );
    }
}