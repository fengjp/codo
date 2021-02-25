import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/tk/v2/accounts/ranking/upload/'
export const UploadUrl2 = baseUrl + '/tk/v2/accounts/ranking/upload2/'
export const UploadUrl3 = baseUrl + '/tk/v2/accounts/business/upload3/'

export const meterList = () => {
  return axios.request({
    url: '/tk/v2/accounts/meter/',
    method: 'get'

  })
}

export const getbusinesslist = (start_date) => {
  return axios.request({
    url: '/tk/v2/accounts/business/',
    method: 'get',
    params: {
      start_date,
    }
  })
}

export const getcitydata = (bjriqi,city) => {
  return axios.request({
    url: '/tk/v2/accounts/getcity/',
    method: 'get',
    params: {
      bjriqi,
      city
    }
  })
}

export const getcitydata2 = (data) => {
  return axios.request({
    url: '/tk/v2/accounts/zhibiao/',
    method: 'post',
    data
  })
}

export const rankinglist = (start_date,end_date,flag) => {
  return axios.request({
    url: '/tk/v2/accounts/ranking/',
    method: 'get',
    params: {
      start_date,
      end_date,
      flag
    }
  })
}

export const getshangyue = () => {
  return axios.request({
    url: '/tk/v2/accounts/ranking/shangyue/',
    method: 'get',
  })
}

export const getbjdata = (bjdata) => {
  return axios.request({
    url: '/tk/v2/accounts/bjdata/',
    method: 'get',
    params: {
      bjdata
    }
  })
}

export const getlinedata = (name,start_date,end_date) => {
  return axios.request({
    url: '/tk/v2/accounts/linedata/',
    method: 'get',
    params: {
      name,
      start_date,
      end_date
    }
  })
}

export const meteradd = (data) => {
  return axios.request({
    url: '/tk/v2/accounts/meteradd/',
    method: 'post',
    data
  })
}

export const getCommandlist = (key, value) => {
  return axios.request({
    url: '/task/v2/task_layout/command/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationCommand = (data, meth) => {
  return axios.request({
    url: '/task/v2/task_layout/command/',
    method: meth,
    data
  })
}
export const customizedAdd = (data, meth) => {
  return axios.request({
    url: '/tk/v2/accounts/customized/',
    method: meth,
    data
  })
}
export const customizedDelete = (data) => {
  return axios.request({
    url: '/tk/v2/accounts/customizedDelete/',
    method: 'delete',
    data
  })
}
export const customizedList = (page, limit) => {
  return axios.request({
    url: '/tk/v2/accounts/customized/',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 参数对照表
export const getArgslist = (key, value) => {
  return axios.request({
    url: '/task/v2/task_layout/args/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationArgs = (data, meth) => {
  return axios.request({
    url: '/task/v2/task_layout/args/',
    method: meth,
    data
  })
}
//
// 执行用户
export const getExecUserlist = () => {
  return axios.request({
    url: '/task/v2/task_layout/user/',
    method: 'get'
  })
}

export const operationExecUserlist = (data, meth) => {
  return axios.request({
    url: '/task/v2/task_layout/user/',
    method: meth,
    data
  })
}
// 模板
export const getTemplist = (key, value) => {
  return axios.request({
    url: '/task/v2/task_layout/temp/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationTemp = (data) => {
  return axios.request({
    url: '/task/v2/task_layout/temp/',
    method: 'post',
    data
  })
}

export const deleteTemp = (data) => {
  return axios.request({
    url: '/task/v2/task_layout/temp/',
    method: 'delete',
    data
  })
}

// 获取模板详情
export const getDetailslist = (value) => {
  return axios.request({
    url: '/task/v2/task_layout/details/',
    method: 'get',
    params: {
      temp_id: value
    }
  })
}
// 获取模板参数
export const getTempargs = (temp_id) => {
  return axios.request({
    url: '/task/v2/task_layout/temp/args/',
    method: 'get',
    params: {
      temp_id
    }
  })
}

export const operationDetails = (data, meth) => {
  return axios.request({
    url: '/task/v2/task_layout/details/',
    method: meth,
    data
  })
}
// 任务订单
export const getTaskOrderlist = () => {
  return axios.request({
    url: '/task/v2/task/list/',
    method: 'get'
  })
}

// 审批执行   终止
export const operationOrderlist = (data, meth) => {
  return axios.request({
    url: '/task/v2/task/list/',
    method: meth,
    data
  })
}

// 审批干预
export const operationChecklist = (data, meth) => {
  return axios.request({
    url: '/task/v2/task/check/',
    method: meth,
    data
  })
}

// 查看订单详情
export const getTaskChecklist = (listId, getRunGroup, getRunHost) => {
  return axios.request({
    url: '/task/v2/task/check/',
    method: 'get',
    params: {
      list_id: listId,
      get_run_group: getRunGroup,
      get_run_host: getRunHost
    }
  })
}

// 查看历史订单
export const getTaskCheckHistorylist = (page, limit, searchVal) => {
  return axios.request({
    url: '/task/v2/task/check_history/',
    method: 'get',
    params: {
      page,
      limit,
      'search_val': searchVal
    }
  })
}

export const businesspost = (data) => {
  return axios.request({
    url: '/tk/v2/accounts/businesspost/',
    method: 'post',
    data
  })
}

const ws = config.isHttps ? 'wss' : 'ws'
const theDomain = process.env.NODE_ENV === 'development' ? config.domainName.dev : config.domainName.pro
// 日志websocket
// export const logWS =  ws + '://' + theDomain + '/api' + '/task/v2/task/ws_log/'
export const logWS = ws + '://' + theDomain + '/api' + '/task/ws/v1/task/log/'
