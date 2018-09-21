import * as React from 'react';
import { FlexboxGrid } from 'rsuite';

// label布局高阶组件
export const LabelWrapper = (Comp) => {
    return ({label, ...props}) => (
        <FlexboxGrid>
            <FlexboxGrid.Item colspan={6}>
                <label>{label}</label>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={18}>
                <Comp {...props} />
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};