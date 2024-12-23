const data = [
  {
    code: 'systemAccessManagement',
    title: '系统接入管理',
    name: '系统接入管理',
    parent: null,
    order: 6,
    label: '系统运营管理',
    value: 'A002',
    hide: 0,
    icon: 'tree',
    isLeaf: false,
    children: [
      {
        code: 'businessEnable',
        title: '业务启用管理',
        name: '业务启用管理',
        parent: 'A002',
        order: 2,
        label: '业务启用管理',
        value: 'A002B001',
        hide: 0,
        icon: 'tree',
        isLeaf: true,
        path: 'systemAccessManagement/businessEnable',
        actions: [
          {
            code: 'businessEnable:enable',
            name: '启用',
            uriFlag: '/ams-base-parameter',
            uri: '/businessEnable/enable',
            method: 'POST',
            type: 'btn',
            label: '启用',
            value: 'A002B001C001',
          },
          {
            code: 'businessEnable:disabled',
            name: '禁用',
            uriFlag: '/ams-base-parameter',
            uri: '/dictategory/disabled',
            method: 'POST',
            type: 'btn',
            label: '禁用',
            value: 'A002B001C002',
          },
        ],
      },
      {
        code: 'businessRegister',
        title: '业务注册管理',
        name: '业务注册管理',
        parent: 'A002',
        order: 2,
        label: '业务注册管理',
        value: 'A002B001',
        hide: 0,
        icon: 'tree',
        isLeaf: true,
        path: 'systemAccessManagement/businessRegister',
        actions: [
          {
            code: 'businessRegister:enable',
            name: '启用',
            uriFlag: '/ams-base-parameter',
            uri: '/businessEnable/enable',
            method: 'POST',
            type: 'btn',
            label: '启用',
            value: 'A002B001C001',
          },
          {
            code: 'businessRegister:disabled',
            name: '禁用',
            uriFlag: '/ams-base-parameter',
            uri: '/dictategory/disabled',
            method: 'POST',
            type: 'btn',
            label: '禁用',
            value: 'A002B001C002',
          },
        ],
      },
    ],
    actions: [],
  },
];

module.exports = {
  data,
};
