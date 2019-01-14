import axios from 'axios';
import { Scope } from 'common/type/scope';
import { replace, ServerReturn } from 'utils/request.utils';

/**
 * 获取页面配置
 */
export async function getBoConfig(ttid: string, scope: Scope) {
    return axios.get<ServerReturn>(replace('/api/config/bo/{ttid}/{scope}', {
        ttid,
        scope,
    }));
}