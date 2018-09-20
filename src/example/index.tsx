import * as React from 'react';
import Board from './Board';

export default class Example extends React.Component {
    render() {
        return (
            <Board knightPosition={[7, 4]}/>
        );
    }
}