import { action, observable, reaction, runInAction } from 'mobx';
import { Notification } from 'rsuite';
import { BoItem, delBoConfig, getBoList } from 'service/bo/bo_list.service';

export const LengthMenu = [{
    value: 10,
    label: 10,
}, {
    value: 20,
    label: 20,
}, {
    value: 50,
    label: 50,
}, {
    value: 100,
    label: 100,
}];

export class BoListStore {
    update = () => {};

    // 用户列表数据
    @observable
    boList: BoItem[] = [];
    @observable
    pageNo: number = 1;
    @observable
    pageSize: number = 10;
    @observable
    total: number = 0;

    // 首次获取数据
    firstFetch = true;

    // 显示modal
    @observable
    showModal = false;

    // 删除的临时id 需要经过确认
    tempDelId = null;
    // 删除loading
    @observable
    delLoading = false;

    @action
    changeTempDelId = (id) => {
        this.tempDelId = id;
    }

    @action
    clearTempDelId = () => {
        this.tempDelId = null;
    }

    @action
    toggleModal = () => {
        this.showModal = !this.showModal;
    }

    // 是否为可用的分页
    _isValidpageNo = (num) => {
        if (num > Math.ceil(this.total / this.pageSize)) {// 超长 不存在
            return false;
        }
        if (num <= 0) { // 不存在
            return false;
        }

        return true;
    }

    // 获取列表数据
    @action
    async fetchBoList() {
        const res = await getBoList(this.pageSize, this.pageNo);
        runInAction(() => {
            const { pageNo, pageSize, data, total } = res.data.data;
            this.pageNo = Number(pageNo);
            this.pageSize = Number(pageSize);
            this.total = Number(total);
            this.boList = data;
            this.firstFetch = false;
        });
    }

    // 删除数据
    @action
    delBoConfig = async () => {
        this.delLoading = true;
        try {
            await delBoConfig(this.tempDelId);

            runInAction(() => {
                this.clearTempDelId();
                this.toggleModal();
                Notification.success({
                     title: '删除成功',
                });
            });
        } catch (e) {
            Notification.error({
                title: '删除失败',
            });
        }

        runInAction(() => {
            this.delLoading = false;
        });
    }

    @action
    changePageNo = (number: number) => {
        this._isValidpageNo(number) && (this.pageNo = number);
    }

    @action
    changePageSize = (size: number) => {
        this.pageSize = size;
        this.pageNo = 1;
    }

    // 分页改变请求数据
    paginationReaction = reaction(() => ({
        pageSize: this.pageSize,
        pageNo: this.pageNo,
    }), () => {
        !this.firstFetch && this.fetchBoList();
    });
}