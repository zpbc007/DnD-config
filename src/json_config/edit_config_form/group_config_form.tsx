import { List, Map } from 'immutable';
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
        groupName: uiSchema.getIn([id, 'ui:name']),
        groupId: id,
        groupIndex: groupOrder.indexOf(id),
    };
}

export function changeSchema(id: string, model: ModelInterface, uiSchema: Map<string, any>) {
    let preGroupOrder = uiSchema.get('ui:order') as List<string>,
            preModel = uiSchema.get(id);
    const preIndex = preGroupOrder.indexOf(id);

    let hasError = false;

    if (id !== model.groupId) {
        if (uiSchema.has(model.groupId)) {
            hasError = true;
            console.error(`配置的群id已经存在: ${model.groupId}!`);
        } else {
            uiSchema = uiSchema.delete(id)
                               .set(model.groupId, preModel);
            preGroupOrder = preGroupOrder.delete(preIndex)
                                         .insert(preIndex, model.groupId);
        }
    }

    if (preModel.get('ui:name') !== model.groupName) {
        preModel = preModel.set('ui:name', model.groupName);
    }

    if (preIndex !== model.groupIndex) {
        preGroupOrder = preGroupOrder.delete(preIndex) // 从原位置删除
                                     .insert(model.groupIndex, id); // 添加到新的位置
    }

    uiSchema = uiSchema.set(model.groupId, preModel)
                       .set('ui:order', preGroupOrder);

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