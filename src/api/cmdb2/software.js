import axios from '@/libs/api.request'
import config from '@/config'

export const operationSoft = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/soft/',
    method: meth,
    data
  })
}

export const getSoftList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/soft/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
      start_date: date[0],
      end_date: date.length > 1 ? date[1] : ''
    }
  })
}

export const operationSoftUpdate = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/soft_update/',
    method: meth,
    data
  })
}

export const getSoftUpdateList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/soft_update/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
      start_date: date[0],
      end_date: date.length > 1 ? date[1] : ''
    }
  })
}

export const getDevSoft = (page, limit, key, value) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/soft_devs/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
    }
  })
}
