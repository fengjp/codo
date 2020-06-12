import axios from '@/libs/api.request'
import config from '@/config'

export const operationSys = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/cmdb/sys/',
    method: meth,
    data
  })
}
