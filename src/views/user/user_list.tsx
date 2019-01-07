import { ActionCell } from 'comp/table_cell/action_cell';
import { IndexCell } from 'comp/table_cell/index_cell';
import { withStore } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { compose } from 'recompose';
import { Button, Icon, Modal, Panel, Table } from 'rsuite';
import { LengthMenu, UserListStore } from './user_list.store';
const { Column, HeaderCell, Cell, Pagination } = Table;

interface InnerProps {
    store: UserListStore;
}

@observer
export class UserList extends React.Component<InnerProps> {
    handleEdit = (e, rowData) => {
        console.log(rowData.id);
    }

    handleDel = (e, rowData) => {
        this.props.store.toggleModal();
    }

    handleDelConfirm = () => {
        this.props.store.toggleModal();
    }

    handleDelCancel = () => {
        this.props.store.toggleModal();
        }

    render() {
        return (
            <Panel
                bordered={true}
                header={<h3>用户列表</h3>}
            >
                {this.renderTable()}
                {this.renderPagination()}
                {this.renderModal()}
            </Panel>
        );
    }

    renderTable() {
        const { userList, pageNumber, pageSize } = this.props.store;

        return (
            <Table
                autoHeight={true}
                data={userList}
            >
                <Column
                    width={50}
                    align='center'
                >
                    <HeaderCell>#</HeaderCell>
                    <IndexCell
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                    />
                </Column>
                <Column
                    width={100}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>账号</HeaderCell>
                    <Cell dataKey='account' />
                </Column>
                <Column
                    width={100}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>昵称</HeaderCell>
                    <Cell dataKey='name' />
                </Column>
                <Column
                    width={100}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>角色</HeaderCell>
                    <Cell dataKey='role' />
                </Column>
                <Column
                    width={150}
                >
                    <HeaderCell>操作</HeaderCell>
                    <ActionCell>
                        <Button
                            size='xs'
                            appearance='primary'
                            onClick={this.handleEdit}
                        >
                            <Icon icon='edit' />编辑
                        </Button>
                        <Button
                            size='xs'
                            appearance='primary'
                            color='red'
                            onClick={this.handleDel}
                        >
                            <Icon icon='trash-o' />删除
                        </Button>
                    </ActionCell>
                </Column>
            </Table>
        );
    }

    renderPagination() {
        const { pageSize, pageNumber, total, changePageSize, changePageNumber } = this.props.store;

        return (
            <Pagination
                lengthMenu={LengthMenu}
                activePage={pageNumber}
                displayLength={pageSize}
                total={total}
                onChangePage={changePageNumber}
                onChangeLength={changePageSize}
            />
        );
    }

    renderModal() {
        const { toggleModal, showModal } = this.props.store;

        return (
            <Modal
                backdrop='static'
                show={showModal}
                onHide={toggleModal}
                size='xs'
            >
                <Modal.Body>
                    <Icon
                        icon='remind'
                    />
                    {'  '}
                    Once a project is disabled, there will be no update on project report, and project
                    members can access history data only. Are you sure you want to proceed?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={toggleModal} appearance='primary'>
                        Ok
                    </Button>
                    <Button onClick={toggleModal} appearance='subtle'>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    componentDidMount() {
        this.props.store.fetchUserList();
    }
}

export default compose<InnerProps, any>(
    withStore(UserListStore)(),
)(UserList);