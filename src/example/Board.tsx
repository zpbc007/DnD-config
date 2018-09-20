import * as React from 'react';
import Knight from './Knight';
import Square from './Square' ;

export default class Board extends React.Component<{knightPosition: number[]}> {

    renderSquare = (i: number) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const black = (x + y) % 2 === 1;

        const [knightX, knightY] = this.props.knightPosition;
        const piece = (x === knightX && y === knightY) ?
            <Knight/> :
            null;

        return (
            <div
                key={i}
                style={{
                    width: '12.5%',
                    height: '12.5%',
                }}
            >
                <Square black={black}>
                    {piece}
                </Square>
            </div>
        );
    }

    render() {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            squares.push(this.renderSquare(i));
        }
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                {squares}
            </div>
        );
    }
}