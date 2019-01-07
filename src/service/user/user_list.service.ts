import axios from 'axios';
import { addQuery, ServerReturn } from 'utils/request.utils';

export interface UserItem {
    id: string;
    account: string;
    enabled: boolean;
    name: string;
    role: string;
}

interface ListReturn<T = any> {
    pageSize: number;
    pageNumber: number;
    total: number;
    data: T[];
}

// 获取用户列表
export async function getUserList(pageSize: number, pageNumber: number) {
    return await axios.get<ServerReturn<ListReturn<UserItem>>>(addQuery('/api/user', {
        pageSize,
        pageNumber,
    }));
}