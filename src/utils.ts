/**
 * 创建对象中的唯一key
 * @param obj 目标对象
 * @param preFix key前缀
 * @param num 次数
 */
export function createQnuiqueKeyInObj(obj, preFix = 'default', num = 0) {
    const key = `${preFix}-${num}`;

    if (obj.hasOwnProperty(key)) {
        return createQnuiqueKeyInObj(obj, preFix, num + 1);
    } else {
        return key;
    }
}