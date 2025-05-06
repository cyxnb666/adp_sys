import Layout from '../layout'

import {Content} from '../layout/components'

import i18n from '../languages/index'

import store from '../store'

export const main = [{
  path: '/dashboard',
  hidden: true,
  component: () => import('@/views/mainPages/dashboard/index.vue'),
  meta: {title: '主页', enable: true}
}, /*{
  path: '/pre-data',
  component: Content,
  meta: {
    // 数据预处理
    title: i18n.t('router.preData'),
    icon: 'icon-nav1',
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
  }
}*/, {
  path: '/rule',
  component: Content,
  // redirect: '/poc/show',
  meta: {
    enable: true,
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_MANAGER'],
    icon: 'icon-nav9',
    title: i18n.t('router.decision')
  },
  children: [{
    path: 'management',
    // 决策规则管理
    meta: {title: i18n.t('router.decision'), enable: true},
    component: () => import('@/views/systemManage/management/index')
  }, {
    path: 'importandexport',
    // 导入导出
    meta: {title: '规则导入/导出', enable: true},
    component: () => import('@/views/systemManage/importandexport/index')
  },{
    path: 'ruleTestDetail',
    hidden: true,
    // 规则测试记录
    meta: { title: '测试记录', enable: true },
    component: () => import('@/views/systemManage/trialManage/ruleTestDetail/index')
  }
    , {
    path: 'rulePropMng',
    // 导入导出
    meta: {title: '规则属性管理', enable: true},
    component: () => import('@/views/systemManage/rulePropMng/index')
  }]
},
   /*{
     path: '/trial',
     component: Content,
     // redirect: '/poc/show',
     meta: {
       enable: true,
       // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_MANAGER'],
       icon: 'icon-nav9',
       title: '测试管理'
     },
     children: [
        {
          path: 'trialManage',
          // 规则测试记录
          meta: { title: '测试管理', enable: true },
          component: () => import('@/views/systemManage/trialManage/testManage/index')
        }, {
          path: 'testCase',
          // 规则测试记录
          meta: { title: '测试用例', enable: true },
         component: () => import('@/views/systemManage/trialManage/testCase/index')
        }, {
          path: 'ruleTesting',
          // 规则测试记录
          meta: { title: '批量测试', enable: true },
         component: () => import('@/views/systemManage/trialManage/ruleTest/index')
        },
        {
          path: 'ruleTestLog',
          // 规则测试记录
          meta: { title: '测试记录', enable: true },
          component: () => import('@/views/systemManage/trialManage/ruleTestLog/index')
        }
     ]
   },*/

  {
  path: '/decision',
  component: Content,
  meta: {
    // 决策规则设置
    title: i18n.t('router.decisionSet'),
    icon: 'icon-nav3',
    // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
    enable: true
  },
  children: [{
    path: 'setting',
    // 规则设置
    meta: {title: i18n.t('router.setting'), enable: true, roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']},
    component: () => import('@/views/mainPages/decision/setting/RuleIndex')
  }, {
    path: 'approve',
    // 规则审批
    meta: {
      title: i18n.t('router.approve'),
      enable: true,
      roles: ['ROLE_STAIR_AUDITOR', 'ROLE_FOXBASE_AUDITOR', 'ROLE_RULE_SETTER']
    },
    component: () => import('@/views/mainPages/decision/approve/ApproveIndex')
  }]
}, {
  path: '/model',
  component: Content,
  meta: {
    // 业务对象模型浏览
    title: i18n.t('router.model'),
    icon: 'icon-nav3',
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
    enable: true
  },
  children: [{
    path: 'preview',
    // 业务对象模型浏览
    meta: {title: i18n.t('router.model'), enable: true},
    component: () => import('@/views/mainPages/view-service-model/ServiceModel')
  }]
}, {
  path: '/version',
  component: Content,
  meta: {
    // 版本管理
    title: i18n.t('router.version'),
    icon: 'icon-nav11',
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
    enable: true
  },
  children: [{
    path: 'versionManage',
    // hidden: true,
    // 版本管理
    meta: {title: '版本管理', enable: true},
    component: () => import('@/views/mainPages/version-management/VersionManage')
  }, {
    path: 'Compare',
    hidden: true,
    // 版本比较
    meta: {title: '版本比较', enable: true},
    component: () => import('@/views/mainPages/version-management/VersionCompare')
  }]
}, /*{
  path: '/rehearsal-management',
  component: Content,
  meta: {
    // 预演管理
    title: i18n.t('router.rehearsal'),
    icon: 'icon-nav5',
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
  }
}*/, {
  path: '/list-report',
  component: Content,
  meta: {
    // 清单报表
    title: i18n.t('router.listReport'),
    enable: true,
    icon: 'icon-nav6',
    // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
    roles: [
      'ROLE_RULE_SETTER', // 规则设置
      'ROLE_RULE_MANAGER', // 规则管理
      'ROLE_SYSTEM_MANAGER', // 系统管理
      'ROLE_STAIR_AUDITOR', // 一级审核员
      'ROLE_FOXBASE_AUDITOR' // 二级审核员
    ]
  },
  children: [{
    path: 'inventory',
    // 清单报表
    meta: {title: i18n.t('router.listReport'), enable: true},
    component: () => import('@/views/mainPages/list-report/ListReport')
  }]
},
  {
    path: '/list-Operations',
    component: Content,
    meta: {
      title: '操作记录',
      enable: true,
      icon: 'icon-nav6',
      // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
      roles: [
        'ROLE_RULE_SETTER', // 规则设置
        'ROLE_RULE_MANAGER', // 规则管理
        'ROLE_SYSTEM_MANAGER', // 系统管理
        'ROLE_STAIR_AUDITOR', // 一级审核员
        'ROLE_FOXBASE_AUDITOR' // 二级审核员
      ]
    },
    children: [
      {
        path: 'operations',
        meta: { title: '操作记录', enable: true },
        component: () => import('@/views/mainPages/list-operations/ListOperations')
      }
      // {
      //   path: 'RuleReport',
      //   meta: { title: '规则清单', enable: true },
      //   component: '/mainPages/list-report/RuleReport'
      // }
    ]
  },
//   {
//   path: '/runlot',
//   component: Content,
//   meta: {
//     // 清单报表
//     title: '跑批测试',
//     enable: true,
//     icon: 'icon-nav6',
//     // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
//     roles: [
//       'ROLE_RULE_SETTER', // 规则设置
//       'ROLE_RULE_MANAGER', // 规则管理
//       'ROLE_SYSTEM_MANAGER', // 系统管理
//       'ROLE_STAIR_AUDITOR', // 一级审核员
//       'ROLE_FOXBASE_AUDITOR' // 二级审核员
//     ]
//   },
//   children: [{
//     path: 'test',
//     // 清单报表
//     meta: {title: '跑批测试', enable: true},
//     component: () => import('@/views/mainPages/run-lot-test')
//   }]
// },
  /*{
  path: '/optimization',
  component: Content,
  meta: {
    // 智能优化
    title: i18n.t('router.optimization'),
    icon: 'icon-nav7',
    roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER']
  }
}*/, {
  path: '/test',
  component: Content,
  meta: {
    // 测试
    title: i18n.t('router.test'),
    icon: 'icon-nav7',
    // roles: ['ROLE_SYSTEM_MAMAGER', 'ROLE_RULE_SETTER']
    roles: [
      'ROLE_RULE_SETTER', // 规则设置
      'ROLE_RULE_MANAGER', // 规则管理
      'ROLE_SYSTEM_MANAGER', // 系统管理
      'ROLE_STAIR_AUDITOR', // 一级审核员
      'ROLE_FOXBASE_AUDITOR' // 二级审核员
    ]
  },
  children: [{
    path: 'execute',
    // 规则执行测试
    meta: {title: i18n.t('router.execute'), enable: true},
    component: () => import('@/views/mainPages/test/rule')
  }, {
    path: 'port',
    // 接口说明
    meta: {title: i18n.t('router.port'), enable: true},
    component: () => import('@/views/mainPages/test/port')
  }]
}]

export const system = [{
  path: '/system-dashboard',
  component: Content,
  hidden: true,
  children: [{
    path: '/',
    name: 'SystemDashboard',
    component: () => import('@/views/systemManage/dashboard/index'),
    meta: {
      // 主页
      title: i18n.t('router.dashboard'),
      // roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_SETTER'],
      roles: [
        'ROLE_RULE_SETTER', // 规则设置
        'ROLE_RULE_MANAGER', // 规则管理
        'ROLE_SYSTEM_MANAGER', // 系统管理
        'ROLE_STAIR_AUDITOR', // 一级审核员
        'ROLE_FOXBASE_AUDITOR' // 二级审核员
      ],
      enable: true
    }
  }]
}, {
  path: '/bom',
  component: Content,
  meta: {
    // 业务对象模型
    title: i18n.t('router.bom'),
    icon: 'icon-nav8',
    roles: ['ROLE_SYSTEM_MAMAGER', 'ROLE_RULE_MANAGER'],
    enable: true
  },
  children: [{
    path: 'creat',
    name: 'BomCreat',
    component: () => import('@/views/systemManage/bom/bomCreat'),
    // 创建业务对象模型
    meta: {title: i18n.t('router.creat'), enable: true}
  }, {
    path: 'manage',
    name: 'bomManage',
    component: () => import('@/views/systemManage/bom/bomManage'),
    // 管理业务对象模型
    meta: {title: i18n.t('router.manage'), enable: true}
  }, {
    path: 'translatemanage',
    name: 'Translatemanage',
    component: () => import('@/views/systemManage/bom/bomLanguage'),
    // BOM模型字段管理
    meta: {title: i18n.t('router.translatemanage'), enable: true}
  }]
}, {
  path: '/basicCode',
  component: Content,
  meta: {
    // 名单库
    title: '基础数据管理',
    enable: true,
    roles: [
      'ROLE_RULE_MANAGER',
      'ROLE_RULE_SETTER',
      'ROLE_SYSTEM_MANAGER'
    ],
    icon: 'icon-nav9'
  },
  children: [{
    path: 'inform',
    meta: {
      icon: 'icon-nav10',
      // 名单库
      title: '基础数据管理',
      enable: true,
      roles: [
        'ROLE_RULE_MANAGER',
        'ROLE_RULE_SETTER',
        'ROLE_SYSTEM_MANAGER'
      ]
    },
    component: () => import('@/views/systemManage/basicCode/index')
  }]
},
  {
    path: '/expressionManagement',
    component: Content,
    meta: {
      // 名单库
      title: '表达式管理',
      enable: true,
      roles: [
        'ROLE_RULE_MANAGER',
        'ROLE_RULE_SETTER',
        'ROLE_SYSTEM_MANAGER'
      ],
      icon: 'icon-nav9'
    },
    children: [
      {
        path: 'inform',
        meta: {
          icon: 'icon-nav10',
          // 名单库
          title: '表达式管理',
          enable: true,
          roles: [
            'ROLE_RULE_MANAGER',
            'ROLE_RULE_SETTER',
            'ROLE_SYSTEM_MANAGER'
          ]
        },
        component: () => import('@/views/systemManage/expressionManagement/index')
      }
    ]
  },
  {
    path: '/new-app',
    component: Content,
    redirect: '/new-app/new',
    meta: {
      enable: true,
      // 决策应用
      title: i18n.t('router.decApp'),
      icon: 'icon-nav10',
      roles: ['ROLE_SYSTEM_MANAGER', 'ROLE_RULE_MANAGER']
    },
    children: [{
      path: 'new',
      meta: {
        icon: 'icon-nav10',
        // 新增决策应用
        title: i18n.t('router.new'),
        enable: true
      },
      component: () => import('@/views/systemManage/newApp/index')
    }, {
      path: 'application',
      meta: {
        icon: 'icon-nav10',
        // 决策应用管理
        title: i18n.t('router.decAppManage'),
        enable: true,
        roles: [
          'ROLE_SYSTEM_MANAGER'
        ]
      },
      component: () => import('@/views/systemManage/application/index')
    }]
  }, {
    path: '/user',
    component: Content,
    // 用户信息管理
    meta: {title: i18n.t('router.user'), enable: true, icon: 'icon-nav9'},
    children: [{
      path: 'info',
      meta: {
        icon: 'icon-nav10',
        // 个人信息
        title: i18n.t('router.info'),
        enable: true

      },
      component: () => import('@/views/systemManage/user/user')
    }, {
      path: '/update-pwd',
      meta: {
        icon: 'icon-nav10',
        // 修改密码
        title: i18n.t('router.updatePwd'),
        enable: true
      },
      component: () => import('@/views/systemManage/user/update-pwd')
    }, {
      path: '/manage',
      meta: {
        icon: 'icon-nav10',
        // 用户管理
        title: i18n.t('router.manageUser'),
        enable: true,
        roles: ['ROLE_SYSTEM_MANAGER']
      },
      component: () => import('@/views/systemManage/user/manage')
    }, {
      path: '/authority',
      meta: {
        icon: 'icon-nav10',
        // 权限管理
        title: i18n.t('router.authority'),
        enable: true,
        roles: [
          'ROLE_SYSTEM_MANAGER',
          'ROLE_RULE_MANAGER',
          'ROLE_RULE_SETTER',
          'ROLE_STAIR_AUDITOR',
          'ROLE_FOXBASE_AUDITOR'
        ]
      },
      component: () => import('@/views/systemManage/user/application-authority')
    }, {
      path: '/pending',
      meta: {
        icon: 'icon-nav10',
        // 审批管理
        title: i18n.t('router.pending'),
        enable: true,
        roles: ['ROLE_SYSTEM_MANAGER']
      },
      component: () => import('@/views/systemManage/user/pending-approval')
    }]
  }, {
    path: '/system',
    component: Content,
    meta: {
      // 系统设置
      title: i18n.t('router.system'),
      enable: true,
      roles: [
        'ROLE_RULE_MANAGER',
        'ROLE_RULE_SETTER'
      ],
      icon: 'icon-nav9'
    },
    children: [{
      path: 'inform',
      meta: {
        icon: 'icon-nav10',
        // 通知管理
        title: i18n.t('router.inform'),
        enable: true,
        roles: [
          'ROLE_RULE_MANAGER',
          'ROLE_RULE_SETTER'
        ]
      },
      component: () => import('@/views/systemManage/system/inform')
    }]
  }]

export const common = [{
  path: '/',
  component: Layout,
  redirect: (to) => {
    console.log(store.state)
    if (store.state.roles) {
    }
    return {path: '/dashboard'}
  },
  children: [...main, ...system]
}, {
  path: '/getApplicationList',
  component: () => import('@/views/ApplicationList/index'),
  hidden: true,
  meta: {enable: true}
}, {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}]
