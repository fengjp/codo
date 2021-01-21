import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export const routerMap = [
  {
    path: '/cmdb',
    name: 'cmdb',
    meta: {
      icon: 'ios-cube',
      title: '资产管理'
    },
    component: Main,
    children: [
      {
        path: 'appsys_mg',
        name: 'appsys_mg',
        meta: {
          icon: 'ios-cube',
          title: '应用系统管理'
        },
        component: () =>
          import ('@/view/cmdb/appsys_mg.vue')
      },
      {
        path: 'software_mg',
        name: 'software_mg',
        meta: {
          icon: 'md-apps',
          title: '软件管理'
        },
        component: () =>
          import ('@/view/cmdb/software_mg.vue')
      },
      {
        path: 'facility_mg',
        name: 'facility_mg',
        meta: {
          icon: 'md-aperture',
          title: '设备管理'
        },
        component: parentView,
        children: [
          {
            path: 'asset_facility',
            name: 'asset_facility',
            meta: {
              icon: 'md-list',
              title: '设备列表'
            },
            component: () =>
              import ('@/view/cmdb/facility_mg.vue')
          },
          {
            path: 'facility_report',
            name: 'facility_report',
            meta: {
              icon: 'ios-book',
              title: '设备报表'
            },
            component: () =>
              import ('@/view/cmdb/facility_report.vue')
          },
        ]
      },
      {
        path: 'asset_server',
        name: 'asset_server',
        meta: {
          icon: 'ios-cube',
          title: '主机管理'
        },
        component: () =>
          import ('@/view/cmdb2/server_mg.vue')
      },
      {
        path: 'asset_db',
        name: 'asset_db',
        meta: {
          icon: 'ios-cube',
          title: 'DB管理'
        },
        component: () =>
          import ('@/view/cmdb2/db_mg.vue')
      },

      // {
      //   path: 'tag_mg',
      //   name: 'tag_mg',
      //   meta: {
      //     icon: 'ios-pricetag',
      //     title: '标签管理'
      //   },
      //   component: () =>
      //     import ('@/view/cmdb2/tag_mg.vue')
      // },
      {
        path: 'admin_user',
        name: 'admin_user',
        meta: {
          icon: 'ios-ribbon',
          title: '主机账号'
        },
        component: () =>
          import ('@/view/cmdb2/admin_user.vue')
      },
      {
        path: 'stakeholder',
        name: 'stakeholder',
        meta: {
          icon: 'ios-people',
          title: '联系人列表'
        },
        component: () =>
          import ('@/view/user-manage/stakeholder.vue')
      },
      {
        path: 'company',
        name: 'company',
        meta: {
          icon: 'ios-people',
          title: '单位列表'
        },
        component: () =>
          import ('@/view/user-manage/company.vue')
      }
    ]
  },
  {
    path: '/web_ssh',
    name: 'web_ssh',
    meta: {
      icon: 'ios-stats',
      title: 'Web终端',
      hideInMenu: true
    },
    component: () =>
      import ('@/view/cmdb2/webssh/web-ssh.vue')
  },
  {
    path: '/customquery',
    name: 'customquery',
    meta: {
      icon: 'md-search',
      title: '自定义监控'
    },
    component: Main,
    children: [
      {
        path: 'queryShow',
        name: 'queryShow',
        meta: {
          icon: 'ios-stats',
          title: '监控展示'
        },
        component: () =>
          import ('@/view/customquery/queryShow.vue')
      },
      {
        path: 'queryConf',
        name: 'queryConf',
        meta: {
          icon: 'md-settings',
          title: '监控配置'
        },
        component: () =>
          import ('@/view/customquery/queryConf.vue')
      },
      {
        path: 'querySubConf',
        name: 'querySubConf',
        meta: {
          icon: 'ios-settings',
          title: '支队监控配置'
        },
        component: () =>
          import ('@/view/customquery/querySubConf.vue')
      }
    ]
  },
  {
    path: '/itmanage',
    name: 'itmanage',
    meta: {
      icon: 'md-paper',
      title: 'ITSM'
    },
    component: Main,
    children: [{
      path: 'case_mg',
      name: 'case_mg',
      meta: {
        icon: 'ios-paper',
        title: '个案管理'
      },
      component: () =>
        import ('@/view/it-manage/problem-manager.vue')
    }
    ]
  },
  // {
  //   path: '/plan',
  //   name: 'plan',
  //   meta: {
  //     icon: 'ios-paper',
  //     title: 'PLAN'
  //   },
  //   component: Main,
  //   children: [{
  //     path: 'plan_mg',
  //     name: 'plan_mg',
  //     meta: {
  //       icon: 'ios-document',
  //       title: '计划工作'
  //     },
  //     component: () =>
  //       import ('@/view/it-manage/plan-manager.vue')
  //   }]
  // },
  {
    path: '/people_admin',
    name: 'people_admin',
    meta: {
      icon: 'ios-cube',
      title: '团队管理'
    },
    component: Main,
    children: [{
      path: 'peoples',
      name: 'peoples',
      meta: {
        icon: 'md-contacts',
        title: '人员'
      },
      component: () =>
        import ('@/view/user-manage/peoplesconf.vue')
    },
      {
        path: 'JobPost',
        name: 'JobPost',
        meta: {
          icon: 'md-desktop',
          title: '岗位'
        },
        component: () =>
          import ('@/view/user-manage/JobPost.vue')
      },
      {
        path: 'meter',
        name: 'meter',
        meta: {
          icon: 'ios-speedometer-outline',
          title: '仪表'
        },
        component: () =>
          import ('@/view/user-manage/meter.vue')
      }
    ]
  }, {
    path: '/SQLreport',
    name: 'SQLreport',
    meta: {
      icon: 'ios-cube',
      title: '脚本管理'
    },
    component: Main,
    children: [{
      path: 'storage_admin',
      name: 'storage_admin',
      meta: {
        icon: 'ios-build-outline',
        title: '存储过程配置'
      },
      component: () =>
        import ('@/view/cmdb2/storage.vue')
    },
      {
        path: 'asset_sql',
        name: 'asset_sql',
        meta: {
          icon: 'ios-build-outline',
          title: '脚本配置'
        },
        component: () =>
          import ('@/view/cmdb2/asset_sql.vue')
      },]
  },

  {
    path: '/report',
    name: 'report',
    meta: {
      icon: 'md-folder',
      title: '报表'
    },
    component: Main,
    children: [{
      path: 'report_mg',
      name: 'report_mg',
      meta: {
        icon: 'ios-cube',
        title: '报表管理'
      },
      component: () =>
        import ('@/view/it-manage/report-manager.vue')
    }]
  },
  {
    path: '/Sqlstatistics',
    name: 'Sqlstatistics',
    meta: {
      icon: 'md-folder',
      title: '报表统计'
    },
    component: Main,
    children: [
      {
        path: 'Sqlscience',
        name: 'Sqlscience',
        meta: {
          icon: 'ios-list-box-outline',
          title: '科技科'
        },
        component: () =>
          import ('@/view/statistics/Sqlexamination.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'md-folder',
      title: '需求统计'
    },
    component: Main,
    children: [{
      path: 'science',
      name: 'science',
      meta: {
        icon: 'ios-list-box-outline',
        title: '科技科'
      },
      component: () =>
        import ('@/view/statistics/examination.vue')
    }
    ]
  },
  {
    path: '/SpoonStatistics',
    name: 'SpoonStatistics',
    meta: {
      icon: 'md-folder',
      title: 'SPOON需求统计'
    },
    component: Main,
    children: [{
      path: 'Spoonscience',
      name: 'Spoonscience',
      meta: {
        icon: 'ios-list-box-outline',
        title: '科技科'
      },
      component: () =>
        import ('@/view/statistics/SpoonExamination.vue')
    }
    ]
  },
  {
    path: '/dataService',
    name: 'dataService',
    meta: {
      icon: 'ios-cloudy',
      title: '数据服务'
    },
    component: Main,
    children: [
      {
        path: 'certdataUp',
        name: 'certdataUp',
        meta: {
          icon: 'md-cloud-upload',
          title: '新版办件上报'
        },
        component: () =>
          import ('@/view/it-manage/dataSerUp.vue')
      },
    ]
  },
  {
    path: '/cron',
    name: 'cron',
    meta: {
      icon: 'ios-alarm',
      title: '定时任务'
    },
    component: Main,
    children: [{
      path: 'cronjobs',
      name: 'cronjobs',
      meta: {
        icon: 'md-alarm',
        title: '定时列表'
      },
      component: () =>
        import ('@/view/cron/cron-jobs.vue')
    },
      {
        path: 'cronlogs',
        name: 'cronlogs',
        meta: {
          icon: 'ios-list-box-outline',
          title: '任务日志'
        },
        component: () =>
          import ('@/view/cron/cron-logs.vue')
      }
    ]
  },
  {
    path: '/usermanage',
    name: 'usermanage',
    meta: {
      icon: 'md-contacts',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'ios-people',
          title: '用户列表'
        },
        component: () =>
          import ('@/view/user-manage/user.vue')
      },
      {
        path: 'functions',
        name: 'functions',
        meta: {
          icon: 'ios-lock',
          title: '权限列表'
        },
        component: () =>
          import ('@/view/user-manage/functions.vue')
      },
      {
        path: 'menus',
        name: 'menus',
        meta: {
          icon: 'ios-menu',
          title: '菜单组件'
        },
        component: () =>
          import ('@/view/user-manage/routescomponents.vue')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'ios-person',
          title: '角色管理'
        },
        component: () =>
          import ('@/view/user-manage/role.vue')
      }
    ]
  },
  {
    path: '/systemmanage',
    name: 'systemmanage',
    meta: {
      icon: 'md-settings',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'system',
        name: 'system',
        meta: {
          icon: 'ios-settings',
          title: '系统配置'
        },
        component: () =>
          import ('@/view/system-manage/system.vue')
      },
      {
        path: 'dictconf',
        name: 'dictconf',
        meta: {
          icon: 'ios-build',
          title: '字典配置'
        },
        component: () =>
          import ('@/view/system-manage/dictconf.vue')
      },
      {
        path: 'typeconf',
        name: 'typeconf',
        meta: {
          icon: 'ios-build',
          title: '个案类型配置'
        },
        component: () =>
          import ('@/view/user-manage/typeconf.vue')
      },
      {
        path: 'systemlog',
        name: 'systemlog',
        meta: {
          icon: 'ios-paper',
          title: '系统日志'
        },
        component: () =>
          import ('@/view/system-manage/systemlog.vue')
      }
    ]
  },
  // {
  //   path: '/repository',
  //   name: 'repository',
  //   meta: {
  //     icon: 'md-book',
  //     title: '知识库'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'doc',
  //       name: 'doc',
  //       meta: {
  //         icon: 'ios-book',
  //         title: '文档管理'
  //       },
  //       component: () =>
  //         import ('@/view/it-manage/doc-manager.vue')
  //     },
  //     {
  //       path: 'faq',
  //       name: 'FAQ',
  //       meta: {
  //         icon: 'md-help-circle',
  //         title: 'FAQ'
  //       },
  //       component: () =>
  //         import ('@/view/it-manage/faq.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/allmeter',
  //   name: 'allmeter',
  //   meta: {
  //     icon: 'md-book',
  //     title: '仪表管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'assessment',
  //       name: 'assessment',
  //       meta: {
  //         icon: 'ios-speedometer-outline',
  //         title: '评估仪表'
  //       },
  //       component: () =>
  //         import ('@/view/meter/assessment.vue')
  //     },
  //     {
  //       path: 'meterMap',
  //       name: 'meterMap',
  //       meta: {
  //         icon: 'ios-speedometer-outline',
  //         title: '评估仪表'
  //       },
  //       component: () =>
  //         import ('@/view/meter/meter_map.vue')
  //     }
  //   ]
  // }

]

export const routes = [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    icon: 'md-home',
    hideInMenu: true
  },
  component: () =>
    import ('@/view/login/login.vue')
},
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () =>
        import ('@/view/single-page/home')
    }]
  },
  {
    path: '/i18n',
    name: 'i18n',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [{
      path: 'i18n_page',
      name: 'i18n_page',
      meta: {
        icon: 'md-planet',
        title: '国际化'
      },
      component: () =>
        import ('@/view/i18n/i18n-page.vue')
    }]
  },
  {
    path: '/403',
    name: 'error_403',
    meta: {
      hideInMenu: true
    },
    component: () =>
      import ('@/view/error-page/403.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () =>
      import ('@/view/error-page/500.vue')
  },
  {
    path: '/loginBack',
    name: 'loginBack',
    meta: {
      hideInMenu: true
    },
    component: () =>
      import ('@/view/loginBack.vue')
  },
  {
    path: '*',
    meta: {
      icon: 'md-home',
      hideInMenu: true
    },
    component: () =>
      import ('@/view/error-page/404.vue')
  },
  {
    path: '/_tips',
    name: '_tips',
    redirect: '/tips',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/tips',
      name: 'tips',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () =>
        import ('@/view/single-page/home/tips.vue')
    }]
  }
]
