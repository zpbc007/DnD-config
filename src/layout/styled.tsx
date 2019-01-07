import { Container, Icon, Navbar } from 'rsuite';
import styled from 'styled-components';

const StyledContainer = styled(Container)`
    min-height: 100vh;
`;

const StyledBanner = styled(Icon)`
    margin-left: 10px;
`;

const StyledHeader = styled(Navbar.Header)`
    padding: 18px 20px;
`;

export {
    StyledContainer,
    StyledHeader,
    StyledBanner,
};