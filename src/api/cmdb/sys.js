import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/cmdb/v1/cmdb/sys/upload/'

export const operationSys = (data, meth) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/sys/',
    method: meth,
    data
  })
}

export const getSysList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/sys/',
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


export const operationSysUpdate = (data, meth) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/sys_update/',
    method: meth,
    data
  })
}

export const getSysUpdateList = (page, limit, key, value, date = ['', '']) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/sys_update/',
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

//获取Tag Tree
export const getTagtree = (key, value) => {
	return axios.request({
		url: '/cmdb/v1/cmdb/sys_tree/',
		method: 'get',
		params: {
			key,
			value
		}
	});
};
