import { Map } from 'immutable';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { action, computed, observable } from 'mobx';
import { createQnuiqueKeyInObj } from 'utils';
import { EditFormCommonProps } from './edit_config_form/type';
import { FieldPosition } from './field_draggable';
import { CompConfigMap, createDefaultTypeWidgetKey, DefaultTypeWidget, FormItemUiSchemaInterface, UiSchemaInterface } from './type';
import { EditableCompEnum } from './type';

const DefaultGroupName = '默认组',
    DefaultGroupIdPreFix = 'default';

export class LayoutStore {
    /**
     * store中主要维护的数据 中心
     */
    @observable
    uiSchema: Map<string, any> = null;
    @observable
    schema: JSONSchema7 = null;
    /** 当前配置组件类型 */
    @observable
    configFormType: EditableCompEnum = null;
    /** 当前配置组件id */
    @observable
    configCompId: string = null;

    /** 当前配置form */
    @computed
    get tempForm(): React.ComponentClass<EditFormCommonProps> {
        if (this.configFormType) {
            return CompConfigMap[this.configFormType].comp;
        } else {
            return null;
        }
    }

    /** 当前配置form数据 */
    @computed
    get tempModel() {
        if (this.configFormType) {
            const { createModel } = CompConfigMap[this.configFormType];

            return createModel(this.configCompId, this.uiSchema);
        } else {
            return {};
        }
    }

    /** 组删除按钮状态 */
    get delBtnDisabled() {
        if (!this.configCompId || this.configFormType !== EditableCompEnum.group) {// 没有选中 或者不为group
            return true;
        } else {
            return false;
        }
    }

    // 从schema中生成默认uiSchema
    private buildUiSchemaFromSchema = (schema: JSONSchema7) => {
        const DefaultGroupId = DefaultGroupIdPreFix,
            DefaultGroupUiOrder = [],
            UiSchema: UiSchemaInterface = {
                'ui:order': [DefaultGroupId] as any,
                [DefaultGroupId]: {
                    'ui:name': DefaultGroupName,
                    'ui:order': DefaultGroupUiOrder,
                },
            };

        for (const fieldId in schema.properties) {
            if (schema.properties.hasOwnProperty(fieldId)) {
                DefaultGroupUiOrder.push(fieldId);
                const { type, format } = schema.properties[fieldId];
                UiSchema[fieldId] = {
                    'ui:widget': DefaultTypeWidget[createDefaultTypeWidgetKey(type as JSONSchema7TypeName, format)],
                } as FormItemUiSchemaInterface;
            }
        }

        return Map(UiSchema);
    }

    /** 更新schema */
    @action
    updateSchema = (schema: JSONSchema7, uiSchema?: UiSchemaInterface) => {
        if (uiSchema) {
            this.uiSchema = Map(uiSchema);
        } else {
            this.uiSchema = this.buildUiSchemaFromSchema(schema);
        }

        this.schema = schema;
    }

    /** 添加组 */
    @action
    addGroup = () => {
        const GroupOrder = this.uiSchema.get('ui:order'),
            groupId = createQnuiqueKeyInObj(this.uiSchema, DefaultGroupIdPreFix);
        GroupOrder.push(groupId);

        this.uiSchema = this.uiSchema.set(groupId, {
            'ui:order': [],
            'ui:name': DefaultGroupName,
        });
    }

    /** 删除组 */
    @action
    delGroup = () => {
        const GroupOrder = this.uiSchema.get('ui:order') as string[],
            index = GroupOrder.indexOf(this.configCompId);

        // 删除
        GroupOrder.splice(index, 1);
        this.uiSchema = this.uiSchema.delete(this.configCompId);
        // 清空数据
        this.configCompId = null;
        this.configFormType = null;
    }

    /** 显示config form */
    @action
    showEditForm = (type: EditableCompEnum, id: string) => {
        this.configFormType = type;
        this.configCompId = id;
    }

    /** 对model更改 */
    @action
    changeModel = (model) => {
        const { changeSchema } = CompConfigMap[this.configFormType],
            { schema, id } = changeSchema(this.configCompId, model, this.uiSchema);

        this.configCompId = id;
        this.uiSchema = schema;
    }

    @action
    changeGroupOrder = (sourceIndex: number, targetIndex: number) => {
        const preOrder = this.uiSchema.get('ui:order'),
            preId = preOrder[sourceIndex];

        // 删除
        preOrder.splice(sourceIndex, 1);
        // 添加
        preOrder.splice(targetIndex, 0, preId);
        this.uiSchema = this.uiSchema.set('ui:order', preOrder.slice());
    }

    @action
    groupAddField = (source: FieldPosition, targetGroupIndex: number) => {
        console.log('groupAddField');
        const { fieldOrder, fieldId, fieldIndex, groupId: sourceGroupId } = this.getFieldInfoByPosition(source);
        // 添加到新的位置
        const groupId = this.uiSchema.get('ui:order')[targetGroupIndex];
        this.uiSchema = this.uiSchema.set(groupId, {
            ...this.uiSchema.get(groupId),
            'ui:order': [...this.uiSchema.get(groupId)['ui:order'], fieldId],
        });
        // 从原来位置删除
        fieldOrder.splice(fieldIndex, 1);
        this.uiSchema = this.uiSchema.set(sourceGroupId, {
            ...this.uiSchema.get(sourceGroupId),
            'ui:order': [...fieldOrder],
        });
    }

    getFieldInfoByPosition = (position: FieldPosition) => {
        const { groupIndex, rowIndex, colIndex, id } = position;
        const groupOrder = this.uiSchema.get('ui:order'),
                groupId = groupOrder[groupIndex],
                fieldOrder = this.uiSchema.get(groupId)['ui:order'],
                fieldIndex = rowIndex * 4 + colIndex;

        return {
            fieldOrder,
            fieldId: id,
            fieldIndex,
            groupId,
        };
    }

    @action
    changeFieldOrder = (start: FieldPosition, end: FieldPosition) => {
        const {
            fieldOrder: startFieldOrder,
            fieldId: startFieldId,
            fieldIndex: startFieldIndex,
            groupId: startGroupId,
        } = this.getFieldInfoByPosition(start);
        const {
            fieldOrder: endFieldOrder,
            fieldId: endFieldId,
            fieldIndex: endFieldIndex,
            groupId: endGroupId,
        } = this.getFieldInfoByPosition(end);

        // 从原来位置删除
        startFieldOrder.splice(startFieldIndex, 1);
        this.uiSchema = this.uiSchema.set(startGroupId, {
            ...this.uiSchema.get(startGroupId),
            'ui:order': startFieldOrder,
        });
        // 添加到新的位置
        endFieldOrder.splice(endFieldIndex, 0, startFieldId);
        this.uiSchema = this.uiSchema.set(endGroupId, {
            ...this.uiSchema.get(endGroupId),
            'ui:order': endFieldOrder,
        });
    }
}