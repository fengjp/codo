import axios from '@/libs/api.request'
import config from '@/config'

export const operationSoft = (data, meth) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/soft/',
    method: meth,
    data
  })
}

export const getSoftList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/soft/',
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

export const getSoftTpye = () => {
  return axios.request({
    url: '/cmdb/v1/cmdb/soft_type/',
    method: 'get',
  })
}


