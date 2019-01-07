import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import { Layout } from 'layout';
import { RouteItem } from 'router';

// 路由配置
const RoutesConfig: RouteItem[] = [{
    path: '/',
    component: Layout,
    routes: [{
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