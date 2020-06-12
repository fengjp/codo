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
                    import ('@/view/cmdb2/appsys_mg.vue')
            },
            {
                path: 'software_mg',
                name: 'software_mg',
                meta: {
                    icon: 'ios-cube',
                    title: '软件管理'
                },
                component: () =>
                    import ('@/view/cmdb2/software_mg.vue')
            },
            // {
            //     path: 'device_mg',
            //     name: 'device_mg',
            //     meta: {
            //         icon: 'ios-cube',
            //         title: '设备管理'
            //     },
            //     component: () =>
            //         import ('@/view/cmdb2/device_mg.vue')
            // },
        ]
    },
    // {
    //     path: '/web_ssh',
    //     name: 'web_ssh',
    //     meta: {
    //         icon: 'ios-stats',
    //         title: 'Web终端',
    //         hideInMenu: true
    //     },
    //     component: () =>
    //         import ('@/view/cmdb2/webssh/web-ssh.vue')
    // },
    // {
    //     path: '/cron',
    //     name: 'cron',
    //     meta: {
    //         icon: 'ios-alarm',
    //         title: '定时任务',
    //         hideInMenu: true
    //     },
    //     component: Main,
    //     children: [{
    //             path: 'cronjobs',
    //             name: 'cronjobs',
    //             meta: {
    //                 icon: 'md-alarm',
    //                 title: '定时列表'
    //             },
    //             component: () =>
    //                 import ('@/view/cron/cron-jobs.vue')
    //         },
    //         {
    //             path: 'cronlogs',
    //             name: 'cronlogs',
    //             meta: {
    //                 icon: 'ios-list-box-outline',
    //                 title: '任务日志'
    //             },
    //             component: () =>
    //                 import ('@/view/cron/cron-logs.vue')
    //         }
    //     ]
    // },
    {
        path: '/itmanage',
        name: 'ITSM',
        meta: {
            icon: 'md-paper',
            title: 'ITSM'
        },
        component: Main,
        children: [{
                path: 'problem',
                name: '个案管理',
                meta: {
                    icon: 'ios-paper',
                    title: '个案管理'
                },
                component: () =>
                    import ('@/view/it-manage/problem-manager.vue')
            },
            {
                path: 'problemr',
                name: 'doc',
                meta: {
                    icon: 'ios-paper',
                    title: '系统文档'
                },
                component: () =>
                    import ('@/view/it-manage/problem-manager.vue')
            },
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
        children: [{
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
        children: [{
                path: 'system',
                name: 'system',
                meta: {
                    icon: 'ios-settings',
                    title: '系统配置'
                },
                component: () =>
                    import ('@/view/system-manage/system.vue')
            },
            // {
            //     path: 'resourceManagement',
            //     name: 'resourceManagement',
            //     meta: {
            //         icon: 'ios-stats',
            //
            //         title: '资源管理'
            //     },
            //     component: () =>
            //         import ('@/view/system-manage/resource-management.vue')
            // },
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
    // {
    //     path: '/doc',
    //     name: 'doc',
    //     meta: {
    //         title: '官方文档',
    //         href: 'https://docs.opendevops.cn',
    //         icon: 'ios-book'
    //     }
    // },
    // {
    //     path: '/join',
    //     name: 'join',
    //     component: Main,
    //     children: [{
    //         path: 'join_page',
    //         name: 'join_page',
    //         meta: {
    //             icon: '_qq',
    //             title: 'QQ交流群'
    //         },
    //         component: () =>
    //             import ('@/view/join-page.vue')
    //     }]
    // },
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
        path: '*',
        meta: {
            icon: 'md-home',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/404.vue')
    }
]
