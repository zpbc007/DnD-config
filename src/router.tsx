import { RouteItem, RoutesConfig } from 'common/route';
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
const RouteWithSubRoutes = (route: RouteItem) => {
    const renderFunc = props => (<route.component {...props} routes={route.routes} />);
    return (
        <Route
            path={route.path}
            render={renderFunc}
            exact={route.exact || false}
        />
    );
};

const PageRoute = () => (
    <IntlProvider locale={zhCN}>
        <Router>
            <Switch>
                {RoutesConfig.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
            </Switch>
        </Router>
    </IntlProvider>
);

export default hot(module)(PageRoute);

export {
    RouteWithSubRoutes,
};