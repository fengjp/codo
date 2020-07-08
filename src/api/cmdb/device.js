import axios from '@/libs/api.request'
import config from '@/config'

export const operationDev = (data, meth) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/dev/',
    method: meth,
    data
  })
}

export const getDevList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/dev/',
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
