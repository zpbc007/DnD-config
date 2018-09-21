export const MockData = {
    schema: { // 标准JSON Schema
        title: '进口报关',
        type: 'object',
        properties: {
            fcustomsno: {// 普通input
                type: 'string',
                title: '报关单号',
            },
            fstockformno: {// 普通input
                type: 'string',
                title: '进库编号',
            },
            fcontractno: {// 普通input
                type: 'string',
                title: '合同协议号',
            },
            fcaseno: {
                type: 'string',
                title: '集装箱号',
            },
            fconsigneename: {// 选择类型
                type: 'string',
                title: '收发货人',
                format: 'select',
            },
            fconsigneenumber: {// 关联选择类型
                type: 'string',
                title: '收发货人编码',
                readOnly: true,
            },
            felectrontype: {// 关联 不显示
                type: 'string',
                title: '类型',
            },
            findate: {// 日期类型
                type: 'string',
                title: '进口日期',
                format: 'date',
            },
            fdeclarationfile: {// 文件
                type: 'string',
                title: '报关单原件',
                format: 'file',
            },
            ffreight: {// 数字
                type: 'number',
                title: '运费',
            },
        },
    },
};
