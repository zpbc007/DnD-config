import * as React from 'react';

let knightPosition = [1, 7];
let observer = null;

function emitChange() {
    observer(knightPosition);
}

export function getKnightPosition() {
    return knightPosition;
}

export function observe(o) {
    if (observer) {
        throw new Error(`多实例暂不支持`);
    }

    observer = o;
    emitChange();
}

export function moveKnight(toX, toY) {
    knightPosition = [toX, toY];
    emitChange();
}

export function canMoveKnight(toX, toY) {
    const [x, y] = knightPosition;
    const dx = toX - x;
    const dy = toY - y;

    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
            (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}