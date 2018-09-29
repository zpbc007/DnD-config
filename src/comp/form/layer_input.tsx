import * as React from 'react';
import { Input, InputGroup } from 'rsuite';
import { FieldCommonProps } from './type';

export default class LayerInput extends React.PureComponent<FieldCommonProps> {
    render() {
        const { type, format, widget, title, ...props } = this.props;
        return (
            <div {...props}>
                <InputGroup>
                    <Input disabled={true}/>
                    <InputGroup.Button appearance='primary'>
                        请选择
                    </InputGroup.Button>
                </InputGroup>
            </div>
        );
    }
}