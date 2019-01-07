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

export {
    ServerReturn,
    addQuery,
};