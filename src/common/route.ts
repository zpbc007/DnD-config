import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import { Layout } from 'layout';
import { RouteItem } from 'router';
import { BoEdit, BoList } from 'views/bo';

// 路由配置
const RoutesConfig: RouteItem[] = [{
    path: '/',
    component: Layout,
    routes: [{
        path: './layoutConfig/bo',
        component: BoList,
    }, {
        path: './layoutConfig/bo/:metaId',
        component: BoEdit,
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