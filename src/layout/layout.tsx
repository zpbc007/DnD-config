import { MenuConfig } from 'common/menu';
import * as React from 'react';
import { Link, Switch } from 'react-router-dom';
import { RouteItem, RouteWithSubRoutes } from 'router';
import { Content, Header, Icon, Nav, Navbar } from 'rsuite';
import { StyledBanner, StyledContainer, StyledContent, StyledHeader } from './styled';

interface PropsInterface {
    routes: RouteItem[];
}

const NavLink = props => (
    <Nav.Item componentClass={Link} {...props} />
);

export class Layout extends React.Component<PropsInterface> {
    render() {
        return (
            <StyledContainer>
                {this.renderHeader()}
                {this.renderContent()}
            </StyledContainer>
        );
    }

    renderHeader = () => {
        return (
            <Header>
                <Navbar appearance='inverse'>
                    <StyledHeader>
                        配置系统
                        <StyledBanner icon='wheelchair-alt' />
                    </StyledHeader>
                    <Navbar.Body>
                        <Nav>
                            {MenuConfig.map(({ icon, path, name }) => {
                                return (
                                    <NavLink
                                        key={path}
                                        icon={<Icon icon={icon} />}
                                        to={path}
                                    >
                                        {name}
                                    </NavLink>
                                );
                            })}
                        </Nav>
                    </Navbar.Body>
                </Navbar>
            </Header>
        );
    }

    renderContent = () => {
        const { routes } = this.props;

        return (
            <StyledContent>
                <Switch>
                    {routes && routes.map(route => RouteWithSubRoutes(route))}
                </Switch>
            </StyledContent>
        );
    }
}