interface MenuItemInterface {
    icon: string;
    path: string;
    name: string;
    desc: string;
}

const MenuConfig: MenuItemInterface[] = [{
    icon: 'th',
    path: '/jsonConfig',
    name: '布局配置',
    desc: '通过拖拽配置form-table页面布局信息',
}, {
    icon: 'th-list',
    path: '/menuConfig',
    name: '菜单配置',
    desc: '配置菜单信息',
}];

export {
    MenuConfig,
    MenuItemInterface,
};