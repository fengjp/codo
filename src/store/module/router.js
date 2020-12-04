import {routes, routerMap} from '@/router/routers'
import {getMenuByRouter} from '@/libs/util'
import {getDictConfList} from '@/api/app'
import store from '@/store'

const state = {
  routers: routes,
  hasGetRules: false
}

const getters = {
  menuList: state => getMenuByRouter(state.routers, 'all')

}
const mutations = {
  CONCAT_ROUTES(state, routerList) {
    state.routers = routerList.concat(routes)
    state.hasGetRules = true
  }
}

const getAccesRouterList = (routes, rules) => {
  return routes.filter(item => {
    if (rules[item.name]) {
      if (item.children) item.children = getAccesRouterList(item.children, rules)
      return true
    } else return false
  })
}


const actions = {
  concatRoutes({commit}, rules) {
    return new Promise((resolve, reject) => {
      try {
        let routerList = []
        // 拼栏目列表
        let  data_statistics_department_list = []
        let  temp_children_list = []
        data_statistics_department_list = eval(localStorage.departmentlist)

            if (data_statistics_department_list) {
              for (var i = 0; i < routerMap.length; i++) {
               if (routerMap[i].name === "statistics") {
                  console.log(routerMap[i].children[0])
                  for (let j = 0; j < data_statistics_department_list.length; j++) {
                        let   temp_department = Object.create(routerMap[i].children[0])
                        temp_department.name = String(data_statistics_department_list[j].v)
                        temp_department.path = String(data_statistics_department_list[j].v)
                        temp_department.meta.title = String(data_statistics_department_list[j].v)
                        temp_children_list.push(temp_department) //组装新的需求统计部门列表
                  }
                  routerMap[i].children  = temp_children_list
               }
              }
            }

        // 如果全部是true 直接返回
        if (Object.entries(rules).every(item => item[1])) {
          routerList = routerMap
        } else {
          routerList = getAccesRouterList(routerMap, rules)
        }

        commit('CONCAT_ROUTES', routerList)
        resolve(routerList)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
}
