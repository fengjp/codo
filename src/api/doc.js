import axios from '@/libs/api.request'
import config from '@/config'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/pb/v1/pb/doc/upload/'

export const getDocList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/pb/v1/pb/doc/',
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

export const operationDoc = (data, meth) => {
  return axios.request({
    url: '/pb/v1/pb/doc/',
    method: meth,
    data
  })
}

export const createFile = (data) => {
  return axios.request({
    url: '/tk/v1/createFile/',
    method: 'post',
    data
  })
}

export const getFileList = (report_na, report_val) => {
  return axios.request({
    url: '/tk/v1/getFileList/',
    method: 'get',
    params: {
      report_na,
      report_val
    }
  })
}
