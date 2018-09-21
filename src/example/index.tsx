import * as React from 'react';
import Board from './Board';
import { getKnightPosition, observe } from './Game';

export default class Example extends React.Component<any, {knightPisition: number[]}> {

    constructor(props) {
        super(props);

        this.state = {
            knightPisition: getKnightPosition(),
        };
    }

    setPosition = (knightPisition) => {
        this.setState({
            knightPisition,
        });
    }

    componentDidMount() {
        observe(this.setPosition);
    }

    render() {
        const { knightPisition } = this.state;
        return (
            <Board knightPosition={knightPisition}/>
        );
    }
}