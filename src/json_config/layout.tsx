import { observer } from 'mobx-react';
import * as React from 'react';
import { Button, Container, Content, FlexboxGrid, Icon } from 'rsuite';
import 'styles/json_config/json_config_container.scss';
import { MockData } from '../../mock/layout.mock';
import CompLayer from './comp_layer';
import JsonViewer from './json_viewer';
import { LayoutStore } from './layout.store';
import { Panel } from './panel';
import { PanelHeader } from './panel_header';
import { EditableCompEnum } from './type';

export const LayoutContext = React.createContext({
    showEditForm: (type: EditableCompEnum, id: string) => null,
});

/**
 * 布局组件 页面根组件 为内部提供必要的context
 *
 * 提供维护uiSchema的方法
 */
@observer
class Layout extends React.Component<{store: LayoutStore}> {
    render() {
        const {
            uiSchema,
            schema,
            tempModel,
            tempForm: ConfigForm,
            changeModel,
            showEditForm,
            addGroup,
            changeGroupOrder,
        } = this.props.store;
        return (
            <Container className='json-config-container'>
                <Content>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={6}>
                            <Panel
                                className='panel-item left'
                                header={PanelHeader('ui schema')}
                                bordered={true}
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
                                bordered={true}
                            >
                                <LayoutContext.Provider value={{showEditForm}}>
                                    <CompLayer
                                        uiSchema={uiSchema}
                                        schema={schema}
                                        changeGroupOrder={changeGroupOrder}
                                    />
                                </LayoutContext.Provider>
                                <Panel
                                    className='add-panel'
                                    bordered={true}
                                >
                                    <Button
                                        onClick={addGroup}
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
                                bordered={true}
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

export default class StoreLayout extends React.Component<any, {store: LayoutStore}> {
    constructor(props) {
        super(props);

        this.state = {
            store: new LayoutStore(),
        };
    }

    componentDidMount() {
        this.state.store.updateSchema(MockData.schema as any);
    }

    render() {
        return (
            <Layout store={this.state.store} />
        );
    }
}