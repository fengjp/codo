import axios from '@/libs/api.request'


export const getFacilityList = (page, limit, key, value) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/facility/',
    method: 'get',
    params: {
      key,
      value,
      page,
      limit
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

export const getFacilityReport = (key) => {
  return axios.request({
    url: '/cmdb/v1/cmdb/facility_report/',
    method: 'get',
    params: {
      key
    }
  })
}

