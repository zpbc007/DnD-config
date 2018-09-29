import { Map } from 'immutable';
import { JSONSchema7 } from 'json-schema';
import * as React from 'react';
import { Form, Input } from 'rsuite';
import FormItem from './form_item';
import { EditFormCommonProps } from './type';

interface ModelInterface {
    disabled: boolean;
    title: string;
    key: string;
}

export function createModel(id: string, uiSchema: Map<string, any>, schema: JSONSchema7) {
    const fieldConfig = uiSchema.get(id);

    return {
        disabled: fieldConfig.get('disabled'),
        title: fieldConfig.get('title') || schema.properties[id].title,
        key: id,
    };
}

export function changeSchema(id: string, model: ModelInterface, uiSchema: Map<string, any>) {
    uiSchema = uiSchema.setIn([id, 'disabled'], model.disabled)
            .setIn([id, 'title'], model.title);

    return {
        id,
        schema: uiSchema,
    };
}

export default class InputConfigForm extends React.Component<EditFormCommonProps<ModelInterface>> {
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
                <FormItem
                    name='title'
                    label='label名称'
                    accepter={Input}
                />
            </Form>
        );
    }
}