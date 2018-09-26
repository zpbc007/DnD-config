import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { action, computed, observable } from 'mobx';
import { createQnuiqueKeyInObj } from 'utils';
import { EditFormCommonProps } from './edit_config_form/type';
import { CompConfigMap, createDefaultTypeWidgetKey, DefaultTypeWidget, FormItemUiSchemaInterface, UiSchemaInterface } from './type';
import { EditableCompEnum } from './type';

const DefaultGroupName = '默认组',
    DefaultGroupIdPreFix = 'default';

export class LayoutStore {
    /**
     * store中主要维护的数据 中心
     */
    @observable
    uiSchema: UiSchemaInterface = null;
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

    // 从schema中生成默认uiSchema
    private buildUiSchemaFromSchema = (schema: JSONSchema7): UiSchemaInterface => {
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

        return UiSchema;
    }

    /** 更新schema */
    @action
    updateSchema = (schema: JSONSchema7, uiSchema?: UiSchemaInterface) => {
        if (uiSchema) {
            this.uiSchema = uiSchema;
        } else {
            this.uiSchema = this.buildUiSchemaFromSchema(schema);
        }

        this.schema = schema;
    }

    /** 添加组 */
    @action
    addGroup = () => {
        const GroupOrder = this.uiSchema['ui:order'],
            groupId = createQnuiqueKeyInObj(this.uiSchema, DefaultGroupIdPreFix);
        GroupOrder.push(groupId);

        this.uiSchema = {
            ...this.uiSchema,
            [groupId]: {
                'ui:order': [],
                'ui:name': DefaultGroupName,
            },
        };
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
        const preOrder = this.uiSchema['ui:order'],
            preId = preOrder[sourceIndex];

        // 删除
        preOrder.splice(sourceIndex, 1);
        // 添加
        preOrder.splice(targetIndex, 0, preId);

        this.uiSchema = {
            ...this.uiSchema,
            'ui:order': preOrder,
        };
    }
}