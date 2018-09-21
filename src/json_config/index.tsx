import JsonViewer from 'comp/json_viewer';
import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Container, Content, FlexboxGrid, Icon, Panel } from 'rsuite';
import 'styles/json_config/json_config_container.scss';
import { MockData } from '../../mock/layout.mock';
import CompLayer from './comp_layer';
import { createDefaultTypeWidgetKey, DefaultTypeWidget, FormItemUiSchemaInterface, UiSchemaInterface } from './type';

class Store {
    // 从schema中生成默认uiSchema
    private buildUiSchemaFromSchema = (schema: JSONSchema7): UiSchemaInterface => {
        const DefaultGroupId = 'default',
            DefaultGroupName = '默认组',
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
        const GroupOrder = this.uiSchema['ui:order'];
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

    }

    render() {
        const { uiSchema, schema } = this.props.store;
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
                                <CompLayer
                                    uiSchema={uiSchema}
                                    schema={schema}
                                />
                                <Panel
                                    className='add-panel'
                                    bordered={true}
                                >
                                    <Button
                                        className='add-btn'
                                    >
                                        <Icon size='5x' icon='plus' />
                                    </Button>
                                </Panel>
                            </Panel>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={6}>
                            <Panel
                                onClick={this.handleAddGroup}
                                className='panel-item right'
                                header={PanelHeader('组件配置信息')}
                            >
                                配置表单部分
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