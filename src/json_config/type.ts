import Date from 'comp/form/date';
import FileUpload from 'comp/form/file_upload';
import Input from 'comp/form/input';
import LayerInput from 'comp/form/layer_input';
import NumberInput from 'comp/form/number';
import { JSONSchema7TypeName } from 'json-schema';
import GroupComp, { changeSchema as changeGroupSchema, createModel as createGroupModel } from './edit_config_form/group_config_form';
import InputComp, { changeSchema as changeInputSchema, createModel as createInputModel } from './edit_config_form/input_config_form';
import UnSupportComp, { createModel as createUnsupportModel } from './edit_config_form/unsupport_config_form';

// 组件类型enum
export enum WidgetTypeEnum {
    input = 'input',
    layerInput = 'layerInput',
    date = 'date',
    notSupport = 'notSupport',
    number = 'number',
    fileUpload = 'fileUpload',
    group = 'group',
}

// 可编辑组件 form map
export const CompConfigMap = {
    [WidgetTypeEnum.group]: {
        createModel: createGroupModel,
        comp: GroupComp,
        changeSchema: changeGroupSchema,
    },
    [WidgetTypeEnum.input]: {
        createModel: createInputModel,
        comp: InputComp,
        changeSchema: changeInputSchema,
    },
    unsupport: {
        comp: UnSupportComp,
        createModel: createUnsupportModel,
    },
};

// 组件类型map
export const WidgetMap = {
    [WidgetTypeEnum.input]: Input,
    [WidgetTypeEnum.layerInput]: LayerInput,
    [WidgetTypeEnum.date]: Date,
    [WidgetTypeEnum.notSupport]: Input,
    [WidgetTypeEnum.number]: NumberInput,
    [WidgetTypeEnum.fileUpload]: FileUpload,
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

export enum DragDropEnum {
    FieldItem = 'FieldItem', // 单个字段可以被拖拽,
    GroupItem = 'GroupItem', // 组 可以作为容器
}