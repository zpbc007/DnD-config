import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import { BasicLayout } from 'layout/basic';
import * as React from 'react';
import { Menu } from 'views/menu';
import { AddAndEdit as PageAddAndEdit, List as PageList } from 'views/page_config';

interface RouteItem {
    path?: string;
    component: React.ComponentClass;
    routes?: RouteItem[];
    title?: string;
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
        path: '/menuConfig',
        component: BasicLayout,
        routes: [{
            path: '/page/list',
            component: PageList,
            title: '页面列表',
        }, {
            path: '/page/add',
            component: PageAddAndEdit,
            exact: true,
            title: '添加页面',
        }, {
            path: '/page/:id',
            component: PageAddAndEdit,
            title: '编辑页面',
        }],
    }, {
        component: NotFoundPage,
    },
];

// 把子路由path添加上父路由path
function fixPath(routesConfig: RouteItem[], prePath = '') {
    return routesConfig.map(item => {
        const absPath = `${prePath}${item.path}`;
        if (item.routes) {
            item.routes = fixPath(item.routes, absPath);
        }

        return {
            ...item,
            path: absPath,
        };
    });
}

// 创建path-title map
function createPathTitleMap(routesConfig: RouteItem[], result = {}) {
    for (const route of routesConfig) {
        if (route.title && route.path) {
            result[route.path] = route.title;
        }

        if (route.routes) {
            createPathTitleMap(route.routes, result);
        }
    }

    return result;
}

const AbsRoutesConfig = fixPath(RoutesConfig);
const TitleMap = createPathTitleMap(AbsRoutesConfig);

export {
    AbsRoutesConfig as RoutesConfig,
    RouteItem,
    TitleMap,
};