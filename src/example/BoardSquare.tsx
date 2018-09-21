import * as React from 'react';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from './Constants';
import { canMoveKnight, moveKnight } from './Game';
import Square from './Square';

const squareTarget = {
    drop(props) {
        moveKnight(props.x, props.y);
    },
    canDrop(props) {
        return canMoveKnight(props.x, props.y);
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

@DropTarget(ItemTypes.KNIGHT, squareTarget, collect)
export default class BoardSquare extends React.Component<{
    x: number,
    y: number,
    connectDropTarget?: any,
    isOver?: boolean,
    canDrop?: boolean,
}> {
    renderOverlay(color) {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    zIndex: 1,
                    opacity: 0.5,
                    backgroundColor: color,
                }}
            />
        );
    }

    render() {
        const { x, y, connectDropTarget, isOver, canDrop } = this.props;
        const black = (x + y) % 2 === 1;

        return connectDropTarget((
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Square black={black}>
                    {this.props.children}
                </Square>
                {isOver && !canDrop && this.renderOverlay('red')}
                {!isOver && canDrop && this.renderOverlay('yellow')}
                {isOver && canDrop && this.renderOverlay('green')}
            </div>
        ));
    }
}