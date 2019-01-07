import * as React from 'react';
import { pure, withProps } from 'recompose';

// 多实例store
export interface MultiStore {
    // 用于更新store信息
    update: (config: any, ref?: React.RefObject<any>) => void;
}

export const withStoreIns = (storeIns: any) => {
    return withProps({
        store: storeIns,
    });
};

/**
 * 组件的store容器
 * @param Store 组件store
 * @param storePropsMapper 将props转为store的props
 */
export const withStore = (Store: new(arg: any) => MultiStore, storeProps?: any) =>
                        (storePropsMapper = (props) => props) =>
                        (BaseComponent: React.ComponentClass) => {
    const factory = React.createFactory(BaseComponent);
    const storeIns = new Store(storeProps);
    const MapProps = props => {
        const { storeInnerRef = null, ...otherProps } = props;
        const ref = storeInnerRef || React.createRef();
        storeIns.update(storePropsMapper(otherProps), ref);
        return factory({
            ...otherProps,
            store: storeIns,
            ref,
        });
    };

    return pure(MapProps);
};