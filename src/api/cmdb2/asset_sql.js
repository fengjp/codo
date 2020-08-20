import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const getSqlList = (page, limit, key, value, isExport = false) => {
  return axios.request({
    url: '/cmdb2/v1/sql/list/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
      isExport
    }
  })
}

export const SqlAdd = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/sql/add/',
    method: meth,
    data
  })
}

export const getCase = (name) => {
  return axios.request({
    url: '/pb/v2/case/name/',
    method: 'get',
    params: {
      name
    }
  })
}
export const getname = () => {
  return axios.request({
    url: '/pb/v2/case/getname/',
    method: 'get',
    params: {}
  })
}
export const getSoftList2 = (key, value) => {
  return axios.request({
    url: '/pb/v2/case/userlist/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}
export const sqlDelete = (data) => {
  return axios.request({
    url: '/cmdb2/v1/sql/delete/',
    method: 'delete',
    data
  })
}

export const getCaseFile = (startdate, enddate) => {
  return axios.request({
    url: '/pb/v2/case/getfile/',
    method: 'get',
    params: {
      startdate,
      enddate
    }
  })
}

export const getSoftUpdateList2 = (key, value) => {
  return axios.request({
    url: '/pb/v2/case/username/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}
