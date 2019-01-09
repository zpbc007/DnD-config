import * as React from 'react';
import { Table } from 'rsuite';
import { TableCellProps } from 'rsuite/types/TableCell';
import Styled from 'styled-components';
const { Cell } = Table;

interface PropsInterface extends TableCellProps {
    render: (rowData: object, rowIndex: number) => React.ReactNode;
}

const StyledCell = Styled(Cell)`
    && {
        button {
            margin: 0 5px;
        }
    }
`;

export class ActionCell extends React.PureComponent<PropsInterface> {
    render() {
        const { render, rowData, rowIndex, ...props } = this.props;

        return (
            <StyledCell {...props} >
                {render(rowData, rowIndex)}
            </StyledCell>
        );
    }
}