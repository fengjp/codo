import axios from '@/libs/api.request'
import config from '@/config'

// 批量添加DB
export const multiAdddb = (data) => {
  return axios.request({
    url: '/cmdb2//v1/cmdb/db/multi_add/',
    method: 'post',
    data
  })
}

// 获取DBlist
export const getDBlist = (page, limit, key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
    }
  })
}

// 获取DB详情
export const getDBDetail = (key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: 'get',
    params: {
      key,
      value
      // page,
      // limit
    }
  })
}

// 操作DB
export const operationDB = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/',
    method: meth,
    data
  })
}

// 获取DBlist 用于自定义查询
export const getDBListForQry = (key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/forQry',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

// 获取Tag Tree
export const getTagtree = (key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/tree/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

// 测试数据库连接
export const testDB = (data) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/db/test/',
    method: 'post',
    data
  })
}

