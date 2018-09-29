import * as React from 'react';
import { Form, Input } from 'rsuite';
import FormItem from './form_item';
import { EditFormCommonProps } from './type';

interface ModelInterface {
    key: string;
}

export function createModel(id: string, uiSchema: Map<string, any>) {
    return {
        key: id,
    };
}

export default class UnSupportConfigForm extends React.Component<EditFormCommonProps<ModelInterface>> {
    render() {
        return (
            <Form
                formValue={this.props.model}
                onChange={this.props.changeModel}
            >
                <FormItem
                    name='key'
                    label='key'
                    disabled={true}
                    accepter={Input}
                />
            </Form>
        );
    }
}