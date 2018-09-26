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
import { Panel, PropsInterface as PanelPropsInterface } from './panel';
import { DragDropEnum } from './type';

const PanelSource = {
    beginDrag(props: PropsInterface) {
        return {
            id: props.id,
            index: props.index,
        };
    },
};

const PanelTarget = {
    /** hover时改变自身位置 */
    hover(props: PropsInterface, monitor: DropTargetMonitor, component: DraggablePanel | null) {
        if (!component) {
            return;
        }
        const dragIndex = monitor.getItem().index,
            hoverIndex = props.index;

        /** 拖拽到自己上 */
        if (dragIndex === hoverIndex) {
            return;
        }

        /** 获取节点位置 */
        const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect();
        /** 图形中心y值 */
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        /** 获取鼠标位置 */
        const clientOffset = monitor.getClientOffset();
        /** 鼠标距图形上侧位置 */
        const hoverClientY = (clientOffset.y - hoverBoundingRect.top);

        /**
         * 当鼠标位置在图形高度一半时才移动
         * 向下移动时，鼠标位置需在图形下半边
         * 向上移动时，鼠标位置需在图形上半边
         */

        // 向下移动
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // 向上移动
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // 移动
        props.movePanel(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

interface PropsInterface extends PanelPropsInterface {
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
    isDragging?: boolean;
    id: string;
    index: number;
    movePanel: (preIndex: number, targetIndex: number) => void;
}

@DropTarget(
    DragDropEnum.GroupItem,
    PanelTarget,
    (connect: DropTargetConnector) => ({
        connectDropTarget: connect.dropTarget(),
    }),
)
@DragSource(
    DragDropEnum.GroupItem,
    PanelSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }))
export default class DraggablePanel extends Panel<PropsInterface> {
    render() {
        const { connectDragSource, connectDropTarget, isDragging, id, index, movePanel, ...props } = this.props;
        // 被拖拽时隐藏
        const style = {
            opacity: isDragging ? 0 : 1,
        };

        return connectDragSource(connectDropTarget(super.mainRender({...props, className: 'panel-draggable', style})));
    }
}