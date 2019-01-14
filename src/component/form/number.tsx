import * as React from 'react';
import { InputNumber } from 'rsuite';
import { FieldCommonProps } from './type';

export default class NumberInput extends React.PureComponent<FieldCommonProps> {
    render() {
        const { type, format, widget, title, ...props } = this.props;

        return (
            <div {...props}>
                <InputNumber
                    placeholder='请输入数字'
                    disabled={true}
                />
            </div>
        );
    }
}