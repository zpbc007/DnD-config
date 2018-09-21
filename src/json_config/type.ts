import Input from 'comp/form/input';
import { JSONSchema7TypeName } from 'json-schema';

// 组件类型enum
export enum WidgetTypeEnum {
    input = 'input',
    layerInput = 'layerInput',
    date = 'date',
    notSupport = 'notSupport',
    number = 'number',
    fileUpload = 'fileUpload',
}

// 组件类型map
export const WidgetMap = {
    [WidgetTypeEnum.input]: Input,
    [WidgetTypeEnum.layerInput]: Input,
    [WidgetTypeEnum.date]: Input,
    [WidgetTypeEnum.notSupport]: Input,
    [WidgetTypeEnum.number]: Input,
    [WidgetTypeEnum.fileUpload]: Input,
};

export function createDefaultTypeWidgetKey(type: JSONSchema7TypeName, format?: string) {
    return format ? `${type}-${format}` : type;
}

// 字段类型与组件对应map
export const DefaultTypeWidget = {
    [createDefaultTypeWidgetKey('string')]: WidgetTypeEnum.input,
    [createDefaultTypeWidgetKey('string', 'date')]: WidgetTypeEnum.date,
    [createDefaultTypeWidgetKey('string', 'file')]: WidgetTypeEnum.fileUpload,
    [createDefaultTypeWidgetKey('string', 'select')]: WidgetTypeEnum.layerInput,
    [createDefaultTypeWidgetKey('number')]: WidgetTypeEnum.number,
};

// group在ui schema中的定义
export interface GroupUiSchemaInterface {
    // 组内顺序
    'ui:order': string[];
    // 组名
    'ui:name'?: string;
}

// form item在ui schema中的定义
export interface FormItemUiSchemaInterface {
    'ui:widget': WidgetTypeEnum | keyof typeof WidgetTypeEnum;
    'ui:xsOffset'?: number;
    'ui:smOffset'?: number;
    'ui:mdOffset'?: number;
    'ui:lgOffset'?: number;
    'ui:xs'?: number;
    'ui:sm'?: number ;
    'ui:md'?: number;
    'ui:lg'?: number;
    [key: string]: any; // 组件props
}

// ui schema定义
export interface UiSchemaInterface {
    // 定义组顺序
    'ui:order': string[] | any;
    [key: string]: FormItemUiSchemaInterface | GroupUiSchemaInterface;
}

enum DragDropEnum {
    FieldItem = 'FieldItem', // 单个字段可以被拖拽,
    GroupItem = 'GroupItem', // 组 可以作为容器
}