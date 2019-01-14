import { Icon } from 'rsuite';
import styled from 'styled-components';

export const ColorIcon = styled(Icon)<{color: string}>`
    color: ${props => props.color};
`;