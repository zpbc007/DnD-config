import { WidgetMap } from 'json_config/type';
import * as React from 'react';
import { LabelWrapper } from './label_wrapper';
import { FieldCommonProps } from './type';
import UnsupportWidget from './unsupport_widget';

/**
 * 字段容器 存放当前字段配置信息
 */
export default class FieldWrapper extends React.Component<FieldCommonProps>{
    render() {
        const Comp = LabelWrapper(WidgetMap[this.props.widget] || UnsupportWidget);
        const { title, ...otherProps} = this.props;
        return (<Comp label={title} {...otherProps}/>);
    }
}