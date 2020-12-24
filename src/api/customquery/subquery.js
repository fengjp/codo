import axios from '@/libs/api.request'

export const getQueryList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tk/v1/querySubConf/',
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

export const operationQuery = (data, meth) => {
  return axios.request({
    url: '/tk/v1/querySubConf/',
    method: meth,
    data
  })
}

export const patchquery = (data) => {
  return axios.request({
    url: '/tk/v1/querySubConf/',
    method: 'patch',
    data
  })
}

export const getZdLinkList = () => {
  return axios.request({
    url: '/tk/v1/queryZd/',
    method: 'get',
    params: {}
  })
}

export const operationZd = (data, meth) => {
  return axios.request({
    url: '/tk/v1/queryZd/',
    method: meth,
    data
  })
}

export const queryPushConf = (data) => {
  return axios.request({
    url: '/tk/v1/queryPushConf/',
    method: 'post',
    data
  })
}

export const queryPullConf = (data) => {
  return axios.request({
    url: '/tk/v1/queryPullConf/',
    method: 'post',
    data
  })
}

export const getZdInfo = (id) => {
  return axios.request({
    url: '/tk/v1/getZdInfo/',
    method: 'get',
    params: {
      id: id
    }
  })
}
