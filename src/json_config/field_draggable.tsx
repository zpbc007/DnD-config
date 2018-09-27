import * as classNames from 'classnames';
import FieldWrapper from 'comp/form/field_wrapper';
import { FieldCommonProps } from 'comp/form/type';
import * as React from 'react';
import {
    ConnectDragSource,
    ConnectDropTarget,
    DragSource,
    DragSourceConnector,
    DragSourceMonitor,
    DropTarget,
    DropTargetConnector,
    DropTargetMonitor,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { DragDropEnum } from './type';

export interface FieldPosition {
    // 所在组index
    groupIndex: number;
    // 组内行index
    rowIndex: number;
    // 组内列index
    colIndex: number;
    id: string;
}

interface PropsInterface extends FieldCommonProps, FieldPosition {
    moveField: (start: FieldPosition, end: FieldPosition) => void;
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
}

const FieldSource = {
    beginDrag(props: PropsInterface) {
        return {
            id: props.id,
            groupIndex: props.groupIndex,
            rowIndex: props.rowIndex,
            colIndex: props.colIndex,
        };
    },
    isDragging(props: PropsInterface, monitor: DragSourceMonitor) {
        return props.id === monitor.getItem().id;
    },
};

const FieldTarget = {
    /** hover时改变位置 */
    hover(props: PropsInterface, monitor: DropTargetMonitor, component: DraggableField | null) {
        if (!component) {
            return;
        }
        const { groupIndex: dragGroupIndex, rowIndex: dragRowIndex, colIndex: dragColIndex, id: dragId } = monitor.getItem(),
            { groupIndex: hoverGroupIndex, rowIndex: hoverRowIndex, colIndex: hoverColIndex, id: hoverId } = props;

        // 拖拽到自己上
        if (dragGroupIndex === hoverGroupIndex && dragRowIndex === hoverRowIndex && dragColIndex === hoverColIndex) {
            return;
        }

        /** 获取节点位置 */
        const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect();
        /** 图形高度一半 */
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        /** 图形宽度一半 */
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        /** 获取鼠标位置 */
        const clientOffset = monitor.getClientOffset();
        /** 鼠标距图形上侧位置 */
        const hoverClientY = (clientOffset.y - hoverBoundingRect.top);
        /** 鼠标距图形左侧位置 */
        const hoverClientX = (clientOffset.x - hoverBoundingRect.left);

        // 向右移动 需在图形右侧
        if (dragColIndex < hoverColIndex && hoverClientX < hoverMiddleX) {
            return;
        }

        // 向左移动 需在图形左侧
        if (dragColIndex > hoverColIndex && hoverClientX > hoverMiddleX) {
            return;
        }

        props.moveField({
            groupIndex: dragGroupIndex,
            rowIndex: dragRowIndex,
            colIndex: dragColIndex,
            id: dragId,
        }, {
            groupIndex: hoverGroupIndex,
            rowIndex: hoverRowIndex,
            colIndex: hoverColIndex,
            id: hoverId,
        });

        monitor.getItem().rowIndex = hoverRowIndex;
        monitor.getItem().colIndex = hoverColIndex;
        monitor.getItem().groupIndex = hoverGroupIndex;
    },
};

@DropTarget(
    DragDropEnum.FieldItem,
    FieldTarget,
    (connect: DropTargetConnector) => ({
        connectDropTarget: connect.dropTarget(),
    }),
)
@DragSource(
    DragDropEnum.FieldItem,
    FieldSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }),
)
export default class DraggableField extends React.Component<PropsInterface> {
    render() {
        const {
            connectDragSource,
            connectDropTarget,
            id,
            moveField,
            groupIndex,
            rowIndex,
            colIndex,
            isDragging,
            ...props
        } = this.props;
        // 拖拽时隐藏
        const style = {
            opacity: isDragging ? 0 : 1,
        };
        const classes = classNames('field-draggable', {
        });
        return connectDragSource(connectDropTarget((
            <div className={classes} style={style}>
                <FieldWrapper {...props} />
            </div>
        )));
    }
}