import { ColorIcon } from 'component/color_icon';
import { ActionCell } from 'component/table_cell/action_cell';
import { IndexCell } from 'component/table_cell/index_cell';
import { withStore } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Button, Icon, Modal, Panel, Table } from 'rsuite';
import { BoListStore, LengthMenu } from './bo_list.store';
const { Column, HeaderCell, Cell, Pagination } = Table;

interface InnerProps extends RouteComponentProps {
    store: BoListStore;
}

@observer
export class BoList extends React.Component<InnerProps> {
    handleFormEdit = (rowData) => (e) => {
        const { history } = this.props;

        history.push(`/layoutConfig/bo/form/${rowData.token_template_id}`);
    }

    handleTableEdit = (rowData) => (e) => {
        const { history } = this.props;

        history.push(`/layoutConfig/bo/table/${rowData.token_template_id}`);
    }

    // 点击删除按钮
    handleDel = (e, rowData) => {
        const { changeTempDelId, toggleModal } = this.props.store;

        changeTempDelId(rowData.id);
        toggleModal();
    }

    // 确认删除
    handleDelConfirm = () => {
        this.props.store.delBoConfig();
    }

    // 取消删除
    handleDelCancel = () => {
        const { toggleModal, clearTempDelId } = this.props.store;

        clearTempDelId();
        toggleModal();
    }

    render() {
        return (
            <Panel
                bordered={true}
                header={<h3>Bo列表</h3>}
            >
                {this.renderTable()}
                {this.renderPagination()}
                {this.renderModal()}
            </Panel>
        );
    }

    renderTable() {
        const { boList, pageNo, pageSize } = this.props.store;

        return (
            <Table
                autoHeight={true}
                data={boList}
            >
                <Column
                    width={50}
                    align='center'
                >
                    <HeaderCell>#</HeaderCell>
                    <IndexCell
                        pageNo={pageNo}
                        pageSize={pageSize}
                    />
                </Column>
                <Column
                    width={200}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>ttid</HeaderCell>
                    <Cell dataKey='token_template_id' />
                </Column>
                <Column
                    width={150}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>meta id</HeaderCell>
                    <Cell dataKey='meta_id' />
                </Column>
                <Column
                    width={100}
                    align='center'
                    resizable={true}
                >
                    <HeaderCell>名称</HeaderCell>
                    <Cell dataKey='token_template_name' />
                </Column>
                <Column width={400} >
                    <HeaderCell>操作</HeaderCell>
                    <ActionCell
                        render={this.renderActionCell}
                    />
                </Column>
            </Table>
        );
    }

    renderActionCell = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    size='xs'
                    appearance='primary'
                    onClick={this.handleFormEdit(rowData)}
                >
                    <Icon icon='edit' />编辑form
                </Button>
                <Button
                    size='xs'
                    appearance='primary'
                    onClick={this.handleTableEdit(rowData)}
                >
                    <Icon icon='edit' />编辑table
                </Button>
                {rowData.hasFormConfig && (
                    <Button
                        size='xs'
                        appearance='primary'
                        color='red'
                        onClick={this.handleDel}
                    >
                        <Icon icon='trash-o' />删除form
                    </Button>
                )}
                {rowData.hasTableConfig && (
                    <Button
                        size='xs'
                        appearance='primary'
                        color='red'
                        onClick={this.handleDel}
                    >
                        <Icon icon='trash-o' />删除table
                    </Button>
                )}
            </React.Fragment>
        );
    }

    renderPagination() {
        const { pageSize, pageNo, total, changePageSize, changePageNo } = this.props.store;

        return (
            <Pagination
                lengthMenu={LengthMenu}
                activePage={pageNo}
                displayLength={pageSize}
                total={total}
                onChangePage={changePageNo}
                onChangeLength={changePageSize}
            />
        );
    }

    renderModal() {
        const { toggleModal, showModal, delLoading } = this.props.store;

        return (
            <Modal
                backdrop='static'
                show={showModal}
                onHide={toggleModal}
                size='xs'
            >
                <Modal.Header>
                    <ColorIcon
                        icon='warning'
                        color='red'
                    />
                    {'   '}
                    删除
                </Modal.Header>
                <Modal.Body>
                    是否删除当前数据配置？
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={this.handleDelConfirm}
                        appearance='primary'
                        color='red'
                        loading={delLoading}
                    >
                        删除
                    </Button>
                    <Button
                        onClick={this.handleDelCancel}
                        appearance='subtle'
                        disabled={delLoading}
                    >
                        取消
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    componentDidMount() {
        this.props.store.fetchBoList();
    }
}

export default compose<InnerProps, any>(
    withRouter,
    withStore(BoListStore)(),
)(BoList);