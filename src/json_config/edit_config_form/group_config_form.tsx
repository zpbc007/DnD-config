import * as React from 'react';
import { Form, Input } from 'rsuite';
import { UiSchemaInterface } from '../type';
import FormItem from './form_item';
import { EditFormCommonProps } from './type';

interface ModelInterface {
    groupName: string;
    groupId: string;
    groupIndex: number;
}

export function createModel(id: string, uiSchema: UiSchemaInterface) {
    const groupOrder = uiSchema['ui:order'] as string[];
    return {
        groupName: uiSchema[id]['ui:name'],
        groupId: id,
        groupIndex: groupOrder.indexOf(id),
    };
}

export function changeSchema(id: string, model: ModelInterface, uiSchema: UiSchemaInterface) {
    const preGroupOrder = uiSchema['ui:order'] as string[],
            preModel = uiSchema[id],
            preIndex = preGroupOrder.indexOf(id);

    let hasError = false;

    if (id !== model.groupId) {
        if (uiSchema.hasOwnProperty(model.groupId)) {
            hasError = true;
            console.error(`配置的群id已经存在: ${model.groupId}!`);
        } else {
            delete uiSchema[id];
            uiSchema[model.groupId] = preModel;
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

    if (hasError) {
        return {
            schema: uiSchema,
            id,
        };
    } else {
        return {
            schema: {
                ...uiSchema,
                'ui:order': preGroupOrder as any,
                [model.groupId]: preModel,
            },
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