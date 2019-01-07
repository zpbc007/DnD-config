import { action, observable, reaction, runInAction } from 'mobx';
import { getUserList, UserItem } from 'service/user/user_list.service';

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

export class UserListStore {
    update = () => {};

    // 用户列表数据
    @observable
    userList: UserItem[] = [];
    @observable
    pageNumber: number = 1;
    @observable
    pageSize: number = 10;
    @observable
    total: number = 0;

    // 首次获取数据
    firstFetch = true;

    // 显示modal
    @observable
    showModal = false;

    @action
    toggleModal = () => {
        this.showModal = !this.showModal;
    }

    // 是否为可用的分页
    _isValidPageNumber = (num) => {
        if (num > Math.ceil(this.total / this.pageSize)) {// 超长 不存在
            return false;
        }
        if (num <= 0) { // 不存在
            return false;
        }

        return true;
    }

    @action
    async fetchUserList() {
        const res = await getUserList(this.pageSize, this.pageNumber);

        runInAction(() => {
            const { pageNumber, pageSize, data, total } = res.data.data;

            this.pageNumber = Number(pageNumber);
            this.pageSize = Number(pageSize);
            this.total = Number(total);
            this.userList = data;
            this.firstFetch = false;
        });
    }

    @action
    changePageNumber = (number: number) => {
        this._isValidPageNumber(number) && (this.pageNumber = number);
    }

    @action
    changePageSize = (size: number) => {
        this.pageSize = size;
        this.pageNumber = 1;
    }

    // 分页改变请求数据
    paginationReaction = reaction(() => ({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
    }), () => {
        !this.firstFetch && this.fetchUserList();
    });
}