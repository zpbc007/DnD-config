import JsonViewer from 'comp/json_viewer';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Container, Content, FlexboxGrid, Icon, Panel } from 'rsuite';
import 'styles/json_config/json_config_container.scss';
import { createQnuiqueKeyInObj } from 'utils';
import { MockData } from '../../mock/layout.mock';
import CompLayer from './comp_layer';
import { EditFormCommonProps } from './edit_config_form/type';
import { CompConfigMap, createDefaultTypeWidgetKey, DefaultTypeWidget, EditableCompEnum, FormItemUiSchemaInterface, UiSchemaInterface } from './type';

const DefaultGroupName = '默认组',
    DefaultGroupIdPreFix = 'default';

export const JsonConfigContext = React.createContext({
    showEditForm: (type: EditableCompEnum, id: string) => null,
});

class Store {
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

    @observable
    uiSchema: UiSchemaInterface = null;
    @observable
    schema: JSONSchema7 = null;
    // 编辑form数据
    @computed
    get tempModel() {
        if (this.configFormType) {
            const { createModel } = CompConfigMap[this.configFormType];

            return createModel(this.configCompId, this.uiSchema);
        } else {
            return {};
        }
    }
    // 编辑form组件
    @observable
    tempForm: React.ComponentClass<EditFormCommonProps> = null;
    @observable
    configFormType: EditableCompEnum = null;
    @observable
    configCompId: string = null;

    @action
    updateSchema = (schema: JSONSchema7, uiSchema?: UiSchemaInterface) => {
        if (uiSchema) {
            this.uiSchema = uiSchema;
        } else {
            this.uiSchema = this.buildUiSchemaFromSchema(schema);
        }

        this.schema = schema;
    }

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

    @action
    showEditForm = (type: EditableCompEnum, id: string) => {
        const { comp } = CompConfigMap[type];

        this.tempForm = comp;
        this.configFormType = type;
        this.configCompId = id;
    }

    @action
    changeModel = (model) => {
        const { changeSchema } = CompConfigMap[this.configFormType];
        const { schema, id } = changeSchema(this.configCompId, model, this.uiSchema);

        this.configCompId = id;
        this.uiSchema = schema;
    }
}

const PanelHeader = (title) => {
    return (
        <div className={'panel-item-title'}>
            {title}
        </div>
    );
};

@observer
class JsonConfigLayout extends React.Component<{store: Store}> {
    handleAddGroup = () => {
        this.props.store.addGroup();
    }

    showEditForm = (type: EditableCompEnum, id: string) => {
        this.props.store.showEditForm(type, id);
    }

    render() {
        const { uiSchema, schema, tempModel, tempForm: ConfigForm, changeModel } = this.props.store;
        return (
            <Container className='json-config-container'>
                <Content>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={6}>
                            <Panel
                                className='panel-item left'
                                header={PanelHeader('ui schema')}
                            >
                                <JsonViewer
                                    value={uiSchema}
                                />
                            </Panel>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={12}>
                            <Panel
                                className='panel-item center'
                                header={PanelHeader('组件')}
                            >
                                <JsonConfigContext.Provider value={{showEditForm: this.showEditForm}}>
                                    <CompLayer
                                        uiSchema={uiSchema}
                                        schema={schema}
                                    />
                                </JsonConfigContext.Provider>
                                <Panel
                                    className='add-panel'
                                    bordered={true}
                                >
                                    <Button
                                        onClick={this.handleAddGroup}
                                        className='add-btn'
                                    >
                                        <Icon size='5x' icon='plus' />
                                    </Button>
                                </Panel>
                            </Panel>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={6}>
                            <Panel
                                className='panel-item right'
                                header={PanelHeader('组件配置信息')}
                            >
                                {ConfigForm ?
                                    (<ConfigForm
                                        model={tempModel}
                                        changeModel={changeModel}
                                    />) :
                                    null
                                }
                            </Panel>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
        );
    }
}

export default class StoreJsonConfigLayout extends React.Component<any, {store: Store}> {
    constructor(props) {
        super(props);

        this.state = {
            store: new Store(),
        };
    }

    componentDidMount() {
        this.state.store.updateSchema(MockData.schema as any);
    }

    render() {
        return (
            <JsonConfigLayout store={this.state.store} />
        );
    }
}