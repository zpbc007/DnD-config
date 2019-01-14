import axios from 'axios';
import { addQuery, ServerReturn } from 'utils/request.utils';

export interface BoItem {
    id: string;
    token_template_id: string;
    meta_id: string;
    self_id: number;
    parent_id: number;
    token_template_name: string;
    token_template_type: string;
}

interface ListReturn<T = any> {
    pageSize: number;
    pageNo: number;
    total: number;
    data: T[];
}

// 获取用户列表
export async function getBoList(pageSize: number, pageNo: number) {
    return axios.get<ServerReturn<ListReturn<BoItem>>>(addQuery('/api/config/bo', {
        pageSize,
        pageNo,
    }));
}

// 删除bo配置
export async function delBoConfig(id: number) {
    return axios.delete(`/api/config/bo/${id}`);
}