import axios from '@/libs/api.request'

export const getQueryList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/tk/v1/queryConf/',
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

export const getQueryListForshow = (key, value) => {
  return axios.request({
    url: '/tk/v1/queryConfForshow/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const operationQuery = (data, meth) => {
  return axios.request({
    url: '/tk/v1/queryConf/',
    method: meth,
    data
  })
}

export const do_sql = (key, value) => {
  return axios.request({
    url: '/tk/v1/queryConf/do_sql/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}

export const patchquery = (data) => {
  return axios.request({
    url: '/tk/v1/queryConf/',
    method: 'patch',
    data
  })
}

export const operationGroup = (data, meth) => {
  return axios.request({
    url: '/tk/v1/operationgroup/',
    method: meth,
    data
  })
}

export const getGroupList = (key, value) => {
  return axios.request({
    url: '/tk/v1/getgroup/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}
