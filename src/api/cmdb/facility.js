import axios from '@/libs/api.request'


export const getFacilityList = (key, value) => {
    return axios.request({
      url: '/cmdb/v1/cmdb/facility/',
      method: 'get',
      params: {
        key,
        value
      }
    })
  }

export const operationFacility = (data, meth) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/facility/',
    method: meth,
    data
  })
}
