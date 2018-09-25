export interface EditFormCommonProps<T = any> {
    // 数据
    model: T;
    // 改变数据
    changeModel: (formData: T) => void;
}