import * as React from 'react';
import { Table } from 'rsuite';
import { TableCellProps } from 'rsuite/types/TableCell';
const { Cell } = Table;

interface PropsInterface extends TableCellProps {
    pageNo: number;
    pageSize: number;
}

export class IndexCell extends React.PureComponent<PropsInterface> {
    render() {
        const { rowIndex, rowData, pageNo, pageSize, ...props } = this.props;

        return (
            <Cell {...props} >
                {(pageNo - 1) * pageSize + rowIndex + 1}
            </Cell>
        );
    }
}