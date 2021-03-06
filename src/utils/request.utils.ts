import * as UrlUtil from 'url';

interface ServerReturn<T = any> {
    message?: string;
    result?: boolean;
    data: T;
}

/**
 * 添加查询字符串
 * @param  url
 * @param  queryVariables
 */
function addQuery(url: string, queryVariables, override = false) {
    const urlObject = UrlUtil.parse(url, true);

    if (override) {
        queryVariables = {
            ...urlObject.query,
            ...queryVariables,
        };
    } else {
        queryVariables = {
            ...queryVariables,
            ...urlObject.query,
        };
    }

    return `${urlObject.pathname}?${Object.keys(queryVariables).map(element => {
        const val = queryVariables[element];
        // 过滤
        if (!val && val !== 0) {
            return null;
        }
        return `${element}=${queryVariables[element]}`;
    }).join('&')}`;
}

/**
 * 替换路径参数
 * @param url 需要进行路径参数替换的url
 * @param pathVariables 路径参数对象
 */
function replace(url: string, pathVariables: object) {
    const regex = /\{([^{^}]*)\}/g;
    return url.replace(regex, (match, $1) => {
        const variable = pathVariables[$1];
        return variable as string;
    });
}

/**
 * 标记当前方法为请求方法
 * @param countAttr 计数器属性
 */
const RequestMethod = function(countAttr: string = '_requestNum') {
    return function(target, name, descriptor) {
        const oldValue = descriptor.value;
        descriptor.value = async function(...args) {
            const hasNum = this && (typeof this[countAttr] === 'number');
            if (hasNum) {
                this[countAttr]++;
            } else {
                console.warn(`decorator RequestMethod need cournt attr ${countAttr}`);
            }

            const result = await oldValue.apply(this, args);

            if (hasNum) {
                this[countAttr]--;
            }

            return result;
        };
        return descriptor;
    };
};

export {
    ServerReturn,
    addQuery,
    replace,
    RequestMethod,
};