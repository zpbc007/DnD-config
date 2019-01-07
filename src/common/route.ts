import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import { Layout } from 'layout';
import { RouteItem } from 'router';
import UserList from 'views/user/user_list';

// 路由配置
const RoutesConfig: RouteItem[] = [{
    path: '/',
    component: Layout,
    routes: [{
        path: './user',
        component: UserList,
    }, {
        path: './example',
        component: Example,
    }, {
        path: './jsonConfig',
        component: JsonConfig,
    }, {
        component: NotFoundPage,
        private: true,
    }],
}];

export {
    RoutesConfig,
};