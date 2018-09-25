import * as React from 'react';
import { DragSource } from 'react-dnd';
import { Panel } from 'rsuite';
import { DragDropEnum } from './type';

const GroupSource = {
    beginDrag(props) {
        return {};
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

@DragSource(DragDropEnum.GroupItem, GroupSource, collect)
export default class DraggableGroup extends React.Component<any> {
    render() {
        const { connectDragSource, ...props } = this.props;
        return connectDragSource((
            <Panel
                {...props}
            />
        ));
    }
}