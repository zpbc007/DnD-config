import * as React from 'react';
import { Input as RsInput } from 'rsuite';
import { FieldCommonProps } from './type';

export default class Input extends React.Component<FieldCommonProps> {
    render() {
        return (
            <RsInput
                disabled={true}
            />
        );
    }
}