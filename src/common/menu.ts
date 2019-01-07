interface MenuItemInterface {
    icon: string;
    path: string;
    name: string;
    desc: string;
}

const MenuConfig: MenuItemInterface[] = [{
    icon: 'user',
    path: '/user',
    name: '用户管理',
    desc: '配置用户信息',
}, {
    icon: '',
    path: '',
    name: '角色管理',
    desc: '配置角色信息',
}, {
    icon: '',
    path: '',
    name: '路由管理',
    desc: '配置路由信息',
}, {
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