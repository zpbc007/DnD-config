import NotFoundPage from 'error_page/page_404';
import Example from 'example';
import { JsonConfig } from 'json_config';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import {
    HashRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import { IntlProvider } from 'rsuite';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';

// 带有子路由
const RouteWithSubRoutes = route => {
    const renderFunc = props => (<route.component {...props} routes={route.routes} />);
    return (
        <Route
            path={route.path}
            render={renderFunc}
            exact={route.exact || false}
        />
    );
};

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
const routesConfig: RouteItem[] = [
    {
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

const PageRoute = () => (
    <IntlProvider locale={zhCN}>
        <Router>
            <Switch>
                {routesConfig.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
            </Switch>
        </Router>
    </IntlProvider>
);

export default hot(module)(PageRoute);