import * as React from 'react';
import { DatePicker } from 'rsuite';
import { FieldCommonProps } from './type';

export default class Date extends React.PureComponent<FieldCommonProps> {
    render() {
        const { type, format, widget, title, ...props } = this.props;

        return (
            <div {...props}>
                <DatePicker
                    style={{width: '100%'}}
                />
            </div>
        );
    }
}