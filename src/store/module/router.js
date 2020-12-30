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

const deepCopy = (obj) =>{
    var result = Array.isArray(obj) ? [] : {}
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(typeof obj[key] === 'object' && obj[key]!==null){
                result[key] = deepCopy(obj[key]);
            } else {
                result[key] = obj[key]
            }
        }
    }
    return result;
}


const  setList =() =>{
       // 拼栏目列表
        let  data_statistics_department_list = []
        let  data_sqlstatistics_department_list = []
        let  data_spoonsqldepartmentlist_department_list = []
        let  temp_children_list = []
        let  temp_children_list2 = []
        let  temp_children_list3 = []
        data_statistics_department_list = eval(localStorage.departmentlist)
        data_sqlstatistics_department_list = eval(localStorage.sqldepartmentlist)
        data_spoonsqldepartmentlist_department_list = eval(localStorage.spoonsqldepartmentlist)

            if (data_statistics_department_list) {
              for (var i = 0; i < routerMap.length; i++) {
                if (routerMap[i].name === "statistics") {
                  console.log(routerMap[i].children[0])
                  for (let j = 0; j < data_statistics_department_list.length; j++) {
                    // let temp_department = Object.create(routerMap[i].children[0])
                    let temp_department = deepCopy(routerMap[i].children[0])
                    temp_department.name = String(data_statistics_department_list[j].v)
                    temp_department.path = String(data_statistics_department_list[j].v)
                    temp_department.meta.title = String(data_statistics_department_list[j].v)
                    temp_children_list.push(temp_department) //组装新的需求统计部门列表
                  }
                  routerMap[i].children = temp_children_list
                }
              }
            }
            if (data_sqlstatistics_department_list) {
              for (var i = 0; i < routerMap.length; i++) {
                if (routerMap[i].name === "Sqlstatistics") {
                  console.log(routerMap[i].children[0])
                  for (let j = 0; j < data_sqlstatistics_department_list.length; j++) {
                    // let temp_department2 = Object.create(routerMap[i].children[0])
                    let temp_department2 = deepCopy(routerMap[i].children[0])
                    temp_department2.name = String(data_sqlstatistics_department_list[j].v)
                    temp_department2.path = String(data_sqlstatistics_department_list[j].v)
                    temp_department2.meta.title = String(data_sqlstatistics_department_list[j].v)
                    temp_children_list2.push(temp_department2) //组装新的需求统计部门列表
                  }
                  routerMap[i].children = temp_children_list2
                }
              }
            }
            if (data_spoonsqldepartmentlist_department_list) {
              for (var i = 0; i < routerMap.length; i++) {
                if (routerMap[i].name === "SpoonStatistics") {
                  console.log(routerMap[i].children[0])
                  for (let j = 0; j < data_spoonsqldepartmentlist_department_list.length; j++) {
                    // let temp_department2 = Object.create(routerMap[i].children[0])
                    let temp_department3 = deepCopy(routerMap[i].children[0])
                    temp_department3.name = String(data_spoonsqldepartmentlist_department_list[j].v)
                    temp_department3.path = String(data_spoonsqldepartmentlist_department_list[j].v)
                    temp_department3.meta.title = String(data_spoonsqldepartmentlist_department_list[j].v)
                    temp_children_list3.push(temp_department3) //组装新的需求统计部门列表
                  }
                  routerMap[i].children = temp_children_list3
                }
              }
            }


}

const actions = {
  concatRoutes({commit}, rules) {
    return new Promise((resolve, reject) => {
      try {
        let routerList = []
        setList()
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
