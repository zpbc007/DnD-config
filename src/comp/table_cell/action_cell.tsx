import * as React from 'react';
import { Table } from 'rsuite';
import { TableCellProps } from 'rsuite/types/TableCell';
import Styled from 'styled-components';
const { Cell } = Table;

interface BtnProps {
    onClick: (e) => void;
}

const StyledCell = Styled(Cell)`
    && {
        button {
            margin: 0 5px;
        }
    }
`;

export class ActionCell extends React.PureComponent<TableCellProps> {
    clickFunc: any;
    handleClick = (e) => {
        const { rowData, rowIndex } = this.props;

        this.clickFunc && this.clickFunc(e, rowData, rowIndex);
    }

    render() {
        const { children, ...props } = this.props;

        return (
            <StyledCell {...props} >
                {React.Children.map(children, (child: React.ReactElement<BtnProps>) => {
                    this.clickFunc = child.props.onClick;

                    return React.cloneElement(child, {
                        ...child.props,
                        onClick: this.handleClick,
                    });
                })}
            </StyledCell>
        );
    }
}