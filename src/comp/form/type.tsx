import { WidgetTypeEnum } from 'json_config/type';

export interface FieldCommonProps {
    /** 字段类型 */
    type: WidgetTypeEnum;
    /** format */
    format: string;
    /** 组件 不指定用默认 */
    widget?: string;
    /** label */
    title: string;
    [key: string]: any;
}