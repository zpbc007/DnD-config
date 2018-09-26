import * as React from 'react';

/**
 * panel 头部
 * @param title 标题
 */
export const PanelHeader = (title) => {
    return (
        <div className={'panel-item-title'}>
            {title}
        </div>
    );
};