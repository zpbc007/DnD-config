import { fromJS, List, Map } from 'immutable';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { action, computed, observable } from 'mobx';
import { Alert } from 'rsuite';
import { createQnuiqueKeyInObj } from 'utils';
import { EditFormCommonProps } from './edit_config_form/type';
import { FieldPosition } from './field_draggable';
import { CompConfigMap, createDefaultTypeWidgetKey, DefaultTypeWidget, FormItemUiSchemaInterface, UiSchemaInterface } from './type';
import { WidgetTypeEnum } from './type';

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
    configFormType: WidgetTypeEnum = null;
    /** 当前配置组件id */
    @observable
    configCompId: string = null;

    /** 当前配置form */
    @computed
    get tempForm(): React.ComponentClass<EditFormCommonProps> {
        if (this.configFormType && CompConfigMap[this.configFormType]) {
            return CompConfigMap[this.configFormType].comp;
        } else if (this.configFormType) {
            return CompConfigMap.unsupport.comp;
        } else {
            return null;
        }
    }

    /** 当前配置form数据 */
    @computed
    get tempModel() {
        let createModel = null;
        if (this.configFormType && CompConfigMap[this.configFormType]) {
            createModel = CompConfigMap[this.configFormType].createModel;
        } else {
            if (this.configFormType) {
                console.log('暂不支持配置类型', this.configFormType, CompConfigMap[this.configFormType]);
            }
            createModel = CompConfigMap.unsupport.createModel;
        }

        return createModel(this.configCompId, this.uiSchema, this.schema);
    }

    /** 组删除按钮状态 */
    get delBtnDisabled() {
        if (!this.configCompId || this.configFormType !== WidgetTypeEnum.group) {// 没有选中 或者不为group
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

        return fromJS(UiSchema);
    }

    /** 更新schema */
    @action
    updateSchema = (schema: JSONSchema7, uiSchema?: UiSchemaInterface) => {
        if (uiSchema) {
            this.uiSchema = fromJS(uiSchema);
        } else {
            this.uiSchema = this.buildUiSchemaFromSchema(schema);
        }

        this.schema = schema;
    }

    /** 添加组 */
    @action
    addGroup = () => {
        const GroupOrder: List<string> = this.uiSchema.get('ui:order'),
            groupId = createQnuiqueKeyInObj(this.uiSchema, DefaultGroupIdPreFix);

        this.uiSchema = this.uiSchema.set('ui:order', GroupOrder.push(groupId)) // 改变order
                                     .set(groupId, fromJS({ // 添加键
                                        'ui:order': [],
                                        'ui:name': DefaultGroupName,
                                    }));
    }

    /** 删除组 */
    @action
    delGroup = () => {
        const GroupOrder: List<string> = this.uiSchema.get('ui:order'),
                index = GroupOrder.indexOf(this.configCompId),
                groupFieldOrder = this.uiSchema.getIn([this.configCompId, 'ui:order']) as List<string>;

        if (groupFieldOrder.size > 0) {
            return Alert.error('组内有其他组件 不能删除');
        }
        // 删除
        this.uiSchema = this.uiSchema.set('ui:order', GroupOrder.delete(index)) // 改变order
                                     .delete(this.configCompId); // 删除key
        // 清空数据
        this.configCompId = null;
        this.configFormType = null;
    }

    /** 显示config form */
    @action
    showEditForm = (type: WidgetTypeEnum, id: string) => {
        if (!type) {
            return;
        }
        if (type === this.configFormType && id === this.configCompId) {
            this.configFormType = null;
            this.configCompId = null;
        } else {
            this.configFormType = type;
            this.configCompId = id;
        }
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
        const preOrder: List<string> = this.uiSchema.get('ui:order'),
            preId = preOrder.get(sourceIndex);

        this.uiSchema = this.uiSchema.set('ui:order', preOrder
            .delete(sourceIndex) // 删除
            .insert(targetIndex, preId)); // 添加
    }

    @action
    groupAddField = (source: FieldPosition, targetGroupIndex: number) => {
        console.log('groupAddField');
        const { fieldOrder, fieldId, fieldIndex, groupId: sourceGroupId } = this.getFieldInfoByPosition(source);
        // 添加到新的位置
        const groupId = this.uiSchema.getIn(['ui:order', targetGroupIndex]);
        this.uiSchema = this.uiSchema.setIn([groupId, 'ui:order'], this.uiSchema.getIn([groupId, 'ui:order']).push(fieldId)) // 添加到新的位置
                                     .setIn([sourceGroupId, 'ui:order'], fieldOrder.delete(fieldIndex)); // 从原来位置删除
    }

    getFieldInfoByPosition = (position: FieldPosition) => {
        const { groupIndex, rowIndex, colIndex, id } = position;
        const groupOrder = this.uiSchema.get('ui:order') as List<string>,
                groupId = groupOrder.get(groupIndex),
                fieldOrder = this.uiSchema.getIn([groupId, 'ui:order']) as List<string>,
                fieldIndex = rowIndex * 4 + colIndex;

        return {
            fieldOrder,
            fieldId: id,
            fieldIndex,
            groupId,
        };
    }

    /**
     * @description 注意 如果是在同一组内移动，从原位置删除后要重新取值
     */
    @action
    changeFieldOrder = (start: FieldPosition, end: FieldPosition) => {
        // 从原来位置删除
        const {
            fieldOrder: startFieldOrder,
            fieldIndex: startFieldIndex,
            groupId: startGroupId,
            fieldId,
        } = this.getFieldInfoByPosition(start);

        this.uiSchema = this.uiSchema.setIn([startGroupId, 'ui:order'], startFieldOrder.delete(startFieldIndex));

        // 添加到新的位置
        const {
            fieldOrder: endFieldOrder,
            fieldIndex: endFieldIndex,
            groupId: endGroupId,
        } = this.getFieldInfoByPosition(end);

        this.uiSchema = this.uiSchema.setIn([endGroupId, 'ui:order'], endFieldOrder.insert(endFieldIndex, fieldId));
    }
}