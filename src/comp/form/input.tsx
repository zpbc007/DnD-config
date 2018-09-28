import * as React from 'react';
import { Input as RsInput } from 'rsuite';
import { FieldCommonProps } from './type';

export default class Input extends React.PureComponent<FieldCommonProps> {
    render() {
        const { type, format, widget, title, ...props } = this.props;

        return (
            <div {...props}>
                <RsInput
                    disabled={true}
                />
            </div>
        );
    }
}