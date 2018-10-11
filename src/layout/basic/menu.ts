interface MenuItem {
    // 菜单名称
    name: string;
    // 菜单路径
    path: string;
    // 菜单图标
    icon: string;
}

const MenuConfig: MenuItem[] = [{
    name: '页面配置',
    path: '/page/list',
    icon: 'file-text',
}, {
    name: '路由配置',
    path: '/route/list',
    icon: 'road',
}, {
    name: '用户配置',
    path: '/user/list',
    icon: 'wheelchair',
}, {
    name: '角色配置',
    path: '/role/list',
    icon: 'wheelchair-alt',
}, {
    name: '菜单配置',
    path: '/menu/list',
    icon: 'th-list',
}];

export {
    MenuItem,
    MenuConfig,
};