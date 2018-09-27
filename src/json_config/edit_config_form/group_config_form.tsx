import { Map } from 'immutable';
import * as React from 'react';
import { Form, Input } from 'rsuite';
import FormItem from './form_item';
import { EditFormCommonProps } from './type';

interface ModelInterface {
    groupName: string;
    groupId: string;
    groupIndex: number;
}

export function createModel(id: string, uiSchema: Map<string, any>) {
    const groupOrder = uiSchema.get('ui:order') as string[];
    return {
        groupName: uiSchema.get(id)['ui:name'],
        groupId: id,
        groupIndex: groupOrder.indexOf(id),
    };
}

export function changeSchema(id: string, model: ModelInterface, uiSchema: Map<string, any>) {
    const preGroupOrder = uiSchema.get('ui:order') as string[],
            preModel = uiSchema.get(id),
            preIndex = preGroupOrder.indexOf(id);

    let hasError = false;

    if (id !== model.groupId) {
        if (uiSchema.has(model.groupId)) {
            hasError = true;
            console.error(`配置的群id已经存在: ${model.groupId}!`);
        } else {
            uiSchema = uiSchema.delete(id);
            uiSchema = uiSchema.set(model.groupId, preModel);
            preGroupOrder.splice(preIndex, 1, model.groupId);
        }
    }

    if (preModel['ui:name'] !== model.groupName) {
        preModel['ui:name'] = model.groupName;
    }

    if (preIndex !== model.groupIndex) {
        preGroupOrder.splice(preIndex, 1);
        preGroupOrder.splice(model.groupIndex, 0, model.groupIndex as any);
    }

    uiSchema = uiSchema.set(model.groupId, {...preModel});
    uiSchema = uiSchema.set('ui:order', preGroupOrder.slice());

    if (hasError) {
        return {
            schema: uiSchema,
            id,
        };
    } else {
        return {
            schema: uiSchema,
            id: model.groupId,
        };
    }

}

/**
 * 组编辑 form
 */
export default class GroupConfigForm extends React.Component<EditFormCommonProps<ModelInterface>> {
    render() {
        return (
            <Form
                formValue={this.props.model}
                onChange={this.props.changeModel}
            >
                <FormItem
                    name='groupName'
                    label='组名'
                    accepter={Input}
                />
                <FormItem
                    name='groupId'
                    label='组id'
                    accepter={Input}
                />
            </Form>
        );
    }
}