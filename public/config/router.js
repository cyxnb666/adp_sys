/**
 * mianRoutes
 * the routes that need to be dynamically loaded based on user roles
 * ROLE_RULE_SETTER   规则设置
 * ROLE_RULE_MANAGER 规则管理
 * ROLE_SYSTEM_MANAGER 系统管理
 * ROLE_STAIR_AUDITOR 一级审核员
 * ROLE_FOXBASE_AUDITOR 二级审核员
 */

 const mian = [
  {
    path: '/pre-data',
    component: 'Layout',
    meta: {
      title: '数据预处理',
      icon: 'icon-nav1',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
    }
  },
  {
    path: '/decision',
    component: 'Layout',
    meta: {
      title: '决策规则管理',
      icon: 'icon-nav3',
      lang:'decision',
      // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
      enable: true
    },
    children: [
      {
        path: 'setting',
        meta: { title: '规则设置', enable: true, roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'] },
        component: '/mainPages/decision/setting/RuleIndex'
      },
      {
        path: 'approve',
        meta: { title: '规则审批', enable: true, roles: ['ROLE_STAIR_AUDITOR', 'ROLE_FOXBASE_AUDITOR', 'ROLE_RULE_SETTER'],},
        component: '/mainPages/decision/approve/ApproveIndex'
      },
      {
        path: 'rule-analysis',
        meta: { title: '规则调整对比', enable: true, roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'] },
        component: '/mainPages/decision/rule-analysis/index'
      }
    ]
  },
  {
    path: '/version',
    component: 'Layout',
    meta: {
      title: '版本管理',
      icon: 'icon-nav11',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
      enable: true
    },
    children: [
      {
        path: 'list',
        meta: { title: '版本列表', enable: true },
        component: '/mainPages/version-management/VersionList'
      },
      {
        path: 'Comparison',
        // hidden: true,
        meta: { title: '版本对比', enable: true },
        component: '/mainPages/version-management/VersionComparisonIndex'
      }
    ]
  },
  {
    path: '/model',
    component: 'Layout',
    meta: {
      title: '业务对象模型浏览',
      icon: 'icon-nav3',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
      enable: true
    },
    children: [
      {
        path: 'preview',
        meta: { title: '业务对象模型浏览', enable: true },
        component: '/mainPages/view-service-model/ServiceModel'
      }
    ]
  },
  {
    path: '/decision-base',
    component: 'Layout',
    meta: {
      title: '决策库浏览',
      icon: 'icon-nav4',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
    },
    children: [
      {
        path: 'BasePreview',
        meta: { title: '决策库浏览', enable: true },
        component: '/mainPages/view-decision-base/DecisionBase'
      }
    ]
  },
  {
    path: '/rehearsal-management',
    component: 'Layout',
    meta: {
      title: '预演管理',
      icon: 'icon-nav5',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
    }
  },
  {
    path: '/list-report',
    component: 'Layout',
    meta: {
      title: '清单报表',
      enable: true,
      icon: 'icon-nav6',
      // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
      roles: [
        'ROLE_RULE_SETTER',  // 规则设置
        'ROLE_RULE_MANAGER', // 规则管理
        'ROLE_SYSTEM_MANAGER', // 系统管理
        'ROLE_STAIR_AUDITOR',// 一级审核员
        'ROLE_FOXBASE_AUDITOR', // 二级审核员
      ],
    },
    children: [
      {
        path: 'inventory',
        meta: { title: '清单报表', enable: true },
        component: '/mainPages/list-report/ListReport'
      },
      // {
      //   path: 'RuleReport',
      //   meta: { title: '规则清单', enable: true },
      //   component: '/mainPages/list-report/RuleReport'
      // }
    ]
  },

  {
    path: '/optimization',
    component: 'Layout',
    meta: {
      title: '智能优化',
      icon: 'icon-nav7',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
    }
  },
  {
    path: '/test',
    component: 'Layout',
    meta: {
      title: '测试',
      icon: 'icon-nav7',
      // roles: ['ROLE_SYSTEM_MAMAGER', 'ROLE_RULE_SETTER']
      roles: [
        'ROLE_RULE_SETTER',  // 规则设置
        'ROLE_RULE_MANAGER', // 规则管理
        'ROLE_SYSTEM_MANAGER', // 系统管理
        'ROLE_STAIR_AUDITOR',// 一级审核员
        'ROLE_FOXBASE_AUDITOR', // 二级审核员
      ],
    },
    children: [
      {
        path: 'execute',
        meta: { title: '规则执行', enable: true },
        component: '/mainPages/test/rule'
      },
      {
        path: 'ruleTableExecute',
        meta: { title: '决策表执行', enable: true },
        component: '/Draggable/components/simple'
      }
    ]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true, meta: { enable: true }}
]

/**
 * systemRoutes
 * 系统管理的路由
 */
 const system = [
  {
    path: '/system-dashboard',
    component: 'Layout',
    hidden: true,
    children: [
      {
        path: '/',
        name: 'SystemDashboard',
        component: '/systemManage/dashboard/index',
        meta: {
          title: '主页',
          // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
          roles: [
            'ROLE_RULE_SETTER',  // 规则设置
            'ROLE_RULE_MANAGER', // 规则管理
            'ROLE_SYSTEM_MANAGER', // 系统管理
            'ROLE_STAIR_AUDITOR',// 一级审核员
            'ROLE_FOXBASE_AUDITOR', // 二级审核员
          ],
          enable: true
        }
      }
    ]
  },
  {
    path: '/bom',
    component: 'Layout',
    meta: {
      title: '业务对象模型',
      icon: 'icon-nav8',
      roles: ['ROLE_SYSTEM_MAMAGER', 'ROLE_RULE_MANAGER'],
      enable: true
    },
    children: [
      {
        path: 'creat',
        name: 'BomCreat',
        component: '/systemManage/bom/bomCreat',
        meta: { title: '创建业务对象模型', enable: true }
      },
      {
        path: 'manage',
        name: 'bomManage',
        component: '/systemManage/bom/bomManage',
        meta: { title: '管理业务对象模型', enable: true }
      },
      {
        path: 'translatemanage',
        name: 'Translatemanage',
        component: '/systemManage/bom/bomLanguage',
        meta: { title: '中文管理业务对象模型', enable: true }
      }
    ]
  },
  {
    path: '/rule',
    component: 'Layout',
    // redirect: '/poc/show',
    meta: {
      enable: true,
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_MANAGER']
    },
    children: [
      {
        path: 'management',
        meta: { title: '决策规则管理', enable: true, icon: 'icon-nav9' },
        component: '/systemManage/management/index'
      }
    ]
  },
  {
    path: '/new-app',
    component: 'Layout',
    redirect: '/new-app/new',
    meta: {
      enable: true,
      title: '决策应用',
      icon: 'icon-nav10',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_MANAGER']
    },
    children: [
      {
        path: 'new',
        meta: {
          icon: 'icon-nav10',
          title: '新增决策应用',
          enable: true
        },
        component: '/systemManage/newApp/index'
      },
      {
        path: 'application',
        meta: {
          icon: 'icon-nav10',
          title: '决策应用管理',
          enable: true
        },
        component: '/systemManage/application/index'
      }
    ]
  },
  {
    path: '/user',
    component: 'Layout',
    meta: { title: '用户信息管理', enable: true, icon: 'icon-nav9' },
    children: [
      {
        path: 'info',
        meta: {
          icon: 'icon-nav10',
          title: '个人信息',
          enable: true

        },
        component: '/systemManage/user/user'
      },
      {
        path: 'update-pwd',
        meta: {
          icon: 'icon-nav10',
          title: '修改密码',
          enable: true
        },
        component: '/systemManage/user/update-pwd'
      },
      {
        path: 'manage',
        meta: {
          icon: 'icon-nav10',
          title: '用户管理',
          enable: true,
          roles: ['ROLE_SYSTEM_MANAGER']
        },
        component: '/systemManage/user/manage'
      },
      {
        path: 'authority',
        meta: {
          icon: 'icon-nav10',
          title: '权限管理',
          enable: true,
          roles: [
            'ROLE_SYSTEM_MANAGER',
            'ROLE_RULE_MANAGER',
            'ROLE_RULE_SETTER',
            'ROLE_STAIR_AUDITOR',
            'ROLE_FOXBASE_AUDITOR'
          ]
        },
        component: '/systemManage/user/application-authority'
      },
      {
        path: 'pending',
        meta: {
          icon: 'icon-nav10',
          title: '审批管理',
          enable: true,
          roles: ['ROLE_SYSTEM_MANAGER']
        },
        component: '/systemManage/user/pending-approval'
      }
    ]
  },
  {
    path: '/system',
    component: 'Layout',
    meta: {
      title: '系统设置',
      enable: true,
      roles: [
        'ROLE_RULE_MANAGER',
        'ROLE_RULE_SETTER',
      ],
      icon: 'icon-nav9'
    },
    children: [
      {
        path: 'systemset',
        meta: {
          icon: 'icon-nav9',
          title: '系统配置',
          enable: true,
          roles: [
            'ROLE_RULE_MANAGER',
            'ROLE_RULE_SETTER',
          ]
        },
        component: '/systemManage/systemSetting/systemset'
      },
      {
        path: 'inform',
        meta: {
          icon: 'icon-nav10',
          title: '通知管理',
          enable: true,
          roles: [
            'ROLE_RULE_MANAGER',
            'ROLE_RULE_SETTER',
          ]
        },
        component: '/systemManage/system/inform'
      },

    ]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true, meta: { enable: true }}
]
