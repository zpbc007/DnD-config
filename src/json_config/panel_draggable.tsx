import * as classNames from 'classnames';
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
import 'styles/json_config/panel/panel.draggable.scss';
import DraggableField, { FieldPosition } from './field_draggable';
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
    hover(props: PropsInterface, monitor: DropTargetMonitor, component: DraggablePanel | DraggableField | null) {
        if (!component) {
            return;
        }
        const sourceType = monitor.getItemType();
        if (sourceType === DragDropEnum.FieldItem) {
            return;
        } else {
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

        }
    },
    drop(props: PropsInterface, monitor: DropTargetMonitor, component: DraggablePanel | DraggableField | null) {
        if (!component) {
            return;
        }
        const sourceType = monitor.getItemType();
        if (sourceType === DragDropEnum.FieldItem && props.index !== monitor.getItem().groupIndex) {
            props.addField(monitor.getItem(), props.index);
        }
    },
};

interface PropsInterface extends PanelPropsInterface {
    connectDragSource?: ConnectDragSource;
    connectDropTarget?: ConnectDropTarget;
    isDragging?: boolean;
    id: string;
    index: number;
    movePanel: (preIndex: number, targetIndex: number) => void;
    addField: (source: FieldPosition, targetGroupIndex: number) => void;
    selected: boolean;
}

@DropTarget(
    [DragDropEnum.GroupItem, DragDropEnum.FieldItem],
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
export default class DraggablePanel extends React.PureComponent<PropsInterface> {
    render() {
        const {
            connectDragSource,
            connectDropTarget,
            isDragging,
            id,
            index,
            movePanel,
            selected,
            addField,
            ...props
        } = this.props;
        // 被拖拽时隐藏
        const style = {
            opacity: isDragging ? 0 : 1,
        };
        const classes = classNames('panel-draggable', {
            selected,
        });
        return connectDragSource(connectDropTarget((
            <div className='panel-draggable-wrapper'>
                <Panel {...props} style={style} className={classes}>
                    {this.props.children}
                </Panel>
            </div>
        )));
    }
}