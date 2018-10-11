import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import { Menu } from 'views/menu';

interface RouteItem {
    path?: string;
    component?: any;
    infinity?: boolean;
    routes?: RouteItem[];
    title?: string;
    private?: boolean;
    redirect?: string;
    exact?: boolean;
}

// 路由配置
const RoutesConfig: RouteItem[] = [
    {
        path: '/',
        component: Menu,
        exact: true,
    }, {
        path: '/example',
        component: Example,
    }, {
        path: '/jsonConfig',
        component: JsonConfig,
    }, {
        component: NotFoundPage,
        private: true,
    },
];

export {
    RoutesConfig,
};