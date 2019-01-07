import { RoutesConfig } from 'common/route';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import {
    HashRouter as Router,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';
import { IntlProvider } from 'rsuite';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import * as UrlUtil from 'url';

export interface RouteItem {
    path?: string;
    component?: any;
    infinity?: boolean;
    routes?: RouteItem[];
    title?: string;
    private?: boolean;
    redirect?: string;
    exact?: boolean;
}

// 渲染路由
export const RouteWithSubRoutes = (route: RouteItem) => {
    const {
        component,
        routes,
        redirect,
        path,
        exact,
        title,
    } = route;

    if (!component && !redirect) {
        throw new Error(`路由未配置组件: ${path}`);
    }

    let Comp: any;
    const compPros: any = {
        routes,
        title,
    };

    if (redirect) {
        Comp = Redirect;
        compPros.to = redirect;
    } else {
        Comp = component;
    }

    return (
        <Route
            key={path || ''}
            path={path}
            exact={exact || false}
            // tslint:disable-next-line:jsx-no-lambda
            render={props => {
                return (
                    <Comp
                        {...compPros}
                        {...props}
                    />
                );
            }}
        />
    );
};

/**
 * 将子路由路径拼接到父级上
 */
function formatRoute(routerArr: RouteItem[], parentPath: string = '/') {
    return routerArr.map(routeItem => {
        if (!routeItem.path) { // 无路1径（404页面）不作做处理
            return routeItem;
        }

        const curPath = UrlUtil.resolve(parentPath, routeItem.path);

        if (routeItem.routes) {
            routeItem.routes = formatRoute(routeItem.routes, `${curPath}`);
        }

        return {
            ...routeItem,
            path: curPath,
        };
    });
}

const PageRoute = () => {
    const routeList = formatRoute(RoutesConfig);
    console.log('route', routeList);
    return (
        <IntlProvider locale={zhCN}>
        <Router>
            <Switch>
                {routeList.map((route) => RouteWithSubRoutes(route))}
            </Switch>
        </Router>
    </IntlProvider>
    );
};

export default hot(module)(PageRoute);