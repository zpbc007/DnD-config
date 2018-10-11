import { RouteItem, TitleMap } from 'common/route';
import * as React from 'react';
import { RouteComponentProps, Switch } from 'react-router-dom';
import { RouteWithSubRoutes } from 'router';
import {
    Container,
    Content,
    Icon,
    Nav,
    Navbar,
    Panel,
    Sidebar,
    Sidenav,
} from 'rsuite';
import 'styles/layout/basic/index.scss';
import { MenuConfig, MenuItem } from './menu';

interface PropsInterface extends RouteComponentProps {
    routes: RouteItem[];
}

interface StateInterface {
    expand: boolean;
}

export class Main extends React.PureComponent<PropsInterface, StateInterface> {
    constructor(props) {
        super(props);
        this.state = {
            expand: true,
        };
    }

    toggleLeftMenu = () => {
        this.setState({
            expand: !this.state.expand,
        });
    }

    handleMenuChange = (menuItem: MenuItem) => {
        const { match, history } = this.props;
        const nextPath = `${match.path}${menuItem.path}`;
        if (history.location.pathname !== nextPath) {
            history.push(nextPath);
        }
    }

    render() {
        const { expand } = this.state;
        const { routes, history } = this.props;
        const title = TitleMap[history.location.pathname] || '';
        return (
            <div className='basic-layout'>
                <Container className='layout-container'>
                    <Sidebar
                        style={{ display: 'flex', flexDirection: 'column' }}
                        width={expand ? 260 : 56}
                        collapsible={true}
                    >
                        <Sidenav.Header>
                            <div
                                style={{
                                    padding: 18,
                                    fontSize: 16,
                                    height: 56,
                                    background: '#34c3ff',
                                    color: ' #fff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                }}
                            >
                                <Icon icon='logo-analytics' size='lg' style={{ verticalAlign: 0 }} />
                                <span style={{ marginLeft: 12 }}> 用户菜单配置</span>
                            </div>
                        </Sidenav.Header>

                        <Sidenav
                            expanded={expand}
                            appearance='subtle'
                            className='side-nav'
                            onSelect={this.handleMenuChange}
                        >
                            <Sidenav.Body>
                                <Nav>
                                    {MenuConfig.map((item) => {
                                        return (
                                            <Nav.Item
                                                key={item.path}
                                                eventKey={item}
                                                icon={<Icon icon={item.icon} />}
                                            >
                                                {item.name}
                                            </Nav.Item>
                                        );
                                    })}
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>

                        <Navbar appearance='subtle' className='nav-toggle'>
                            <Navbar.Body>
                                <Nav pullRight={true}>
                                <Nav.Item onClick={this.toggleLeftMenu} style={{ width: 56, textAlign: 'center' }}>
                                    <Icon icon={expand ? 'angle-left' : 'angle-right'} />
                                </Nav.Item>
                                </Nav>
                            </Navbar.Body>
                        </Navbar>
                    </Sidebar>
                    <Container>
                        <Content className='content-wrapper'>
                            <Panel
                                bordered={true}
                                className='panel-wrapper'
                                header={<h3>{title}</h3>}
                            >
                                <Switch>
                                    {routes.map((route) => <RouteWithSubRoutes key={route.path} {...route} />)}
                                </Switch>
                            </Panel>
                        </Content>
                    </Container>
                </Container>
            </div>
        );
    }
}