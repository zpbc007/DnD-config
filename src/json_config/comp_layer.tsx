import { JSONSchema7 } from 'json-schema';
import * as React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Col, Row } from 'rsuite';
import 'styles/json_config/comp_layer.scss';
import DraggableField, { FieldPosition } from './field_draggable';
import { LayoutContext } from './layout';
import DraggablePanel from './panel_draggable';
import { FormItemUiSchemaInterface, GroupUiSchemaInterface, UiSchemaInterface, WidgetTypeEnum } from './type';

interface PropsInterface {
    uiSchema: UiSchemaInterface;
    schema: JSONSchema7;
    changeGroupOrder: (sourceIndex: number, targetIndex: number) => void;
    groupAddField: (source: FieldPosition, targetGroupIndex: number) => void;
    /** 当前选中组件id */
    selectedId: string;
    changeFieldOrder: (start: FieldPosition, end: FieldPosition) => void;
}

/**
 * 内部组件容器
 */
@DragDropContext(HTML5Backend)
export default class CompLayer extends React.Component<PropsInterface> {
    renderField = (showEditForm) => {
        const { uiSchema, schema } = this.props;
        if (!uiSchema || !schema) {
            return '暂无配置信息';
        }

        const groupOrder = uiSchema['ui:order'] as string[],
            { properties: schemaProperties } = schema,
            Content = [];

        // 遍历组
        for (let groupIndex = 0, groupLen = groupOrder.length; groupIndex < groupLen; groupIndex++) {
            const groupId = groupOrder[groupIndex];

            // 当前组ui定义
            const curGroupSchema = uiSchema[groupId] as GroupUiSchemaInterface,
                fieldOrder = curGroupSchema['ui:order'], // 字段顺序
                groupName = curGroupSchema['ui:name'], // 组名
                GroupContent = []; // 组内行
            let tmpRowList = []; // 当前行内容

            // 遍历组内字段
            for (let fieldIndex = 0, len = fieldOrder.length; fieldIndex < len; fieldIndex++) {
                const field = fieldOrder[fieldIndex],
                    fieldUiSchema = uiSchema[field] as FormItemUiSchemaInterface,
                    rowNum = Math.floor(fieldIndex / 4),
                    colNum = fieldIndex % 4,
                    { type: fieldType, title, format } = schemaProperties[field];

                tmpRowList.push((
                    <Col
                        key={`${groupName}-${rowNum}-${colNum}`}
                        lg={fieldUiSchema && fieldUiSchema['ui:lg'] || 6}
                        md={fieldUiSchema && fieldUiSchema['ui:md'] || 6}
                        sm={fieldUiSchema && fieldUiSchema['ui:sm'] || 6}
                        xs={fieldUiSchema && fieldUiSchema['ui:xs'] || 24}
                        lgOffset={fieldUiSchema && fieldUiSchema['ui:lgOffset'] || 0}
                        mdOffset={fieldUiSchema && fieldUiSchema['ui:mdOffset'] || 0}
                        smOffset={fieldUiSchema && fieldUiSchema['ui:smOffset'] || 0}
                        xsOffset={fieldUiSchema && fieldUiSchema['ui:xsOffset'] || 0}
                    >
                        <DraggableField
                            id={field}
                            selected={field === this.props.selectedId}
                            moveField={this.props.changeFieldOrder}
                            groupIndex={groupIndex}
                            rowIndex={GroupContent.length}
                            colIndex={tmpRowList.length}
                            type={fieldType as any}
                            format={format}
                            title={fieldUiSchema.title || title}
                            widget={fieldUiSchema['ui:widget']}
                            // tslint:disable-next-line:jsx-no-lambda
                            onClick={(e) => {
                                e.stopPropagation();
                                showEditForm(WidgetTypeEnum[fieldUiSchema['ui:widget']] || null, field);
                            }}
                        />
                    </Col>
                ));

                if (colNum === 3 || fieldIndex === len - 1) {// 换行
                    GroupContent.push((
                        <Row key={`${groupName}-${rowNum}`} className='form-row'>
                            {tmpRowList}
                        </Row>
                    ));
                    tmpRowList = [];
                }
            }

            Content.push((
                <DraggablePanel
                    id={groupId}
                    selected={groupId === this.props.selectedId}
                    index={groupIndex}
                    bordered={true}
                    key={groupId}
                    header={<span>{groupName}</span>}
                    className='comp-panel'
                    movePanel={this.props.changeGroupOrder}
                    addField={this.props.groupAddField}
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => showEditForm(WidgetTypeEnum.group, groupId)}
                >
                    {GroupContent}
                </DraggablePanel>
            ));
        }
        return Content;
    }

    render() {
        return (
            <div>
                <LayoutContext.Consumer>
                    {({showEditForm}) => this.renderField(showEditForm)}
                </LayoutContext.Consumer>
            </div>
        );
    }
}