import axios from '@/libs/api.request'
import config from '@/config'


// 获取柱状图展示
export const getCaseBarList = (startdate, enddate) => {
  return axios.request({
    url: '/pb/v2/case/getbar/',
    method: 'get',
    params: {
      startdate,
      enddate,
    }
  })
}

// 任务订单
// export const getTaskOrderlist = () => {
//   return axios.request({
//     url: '/task/v2/task/list/',
//     method: 'get'
//   })
// }


// 历史任务订单状态+数量
// export const getTaskStatementlist = () => {
//   return axios.request({
//     url: '/task/v2/task/statement/',
//     method: 'get'
//   })
// }


export const operationTmp = (data, meth) => {
  return axios.request({
    url: '/tk/v1/operationtmp/',
    method: meth,
    data
  })
}

export const getTmpList = () => {
  return axios.request({
    url: '/tk/v1/gettmp/',
    method: 'get',
    params: {}
  })
}
