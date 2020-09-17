import axios from '@/libs/api.request'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const operationFAQ = (data, meth) => {
  return axios.request({
    url: '/pb/v1/pb/faq/',
    method: meth,
    data
  })
}

export const getFaqList = (page, limit, key, value) => {
  return axios.request({
    url: '/pb/v1/pb/faq/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value
    }
  })
}


