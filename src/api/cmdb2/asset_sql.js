import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const getSqlList = (page, limit, key, value, isExport = false) => {
  return axios.request({
    url: '/cmdb2/v1/sql/list/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value,
      isExport
    }
  })
}
export const getSqlIdList = () => {
  return axios.request({
    url: '/cmdb2/v1/sql/Idlist/',
    method: 'get',
  })
}
export const getSqlIdDate = (value) => {
  return axios.request({
    url: '/cmdb2/v1/sql/IdDate/',
    method: 'get',
    params: {
      value
    }
  })
}

export const SqlAdd = (data, meth) => {
  return axios.request({
    url: '/cmdb2/v1/sql/add/',
    method: meth,
    data
  })
}
export const getdepartmentlist = () => {
  return axios.request({
    url: '/cmdb2/v1/sql/departmentlist/',
    method: 'get',
  })
}

export const getstoragelist = (department,obj) => {
  return axios.request({
    url: '/cmdb2/v1/sql/storagelist/',
    method: 'get',
    params: {
      department,
      obj
    }
  })
}
export const getobjlist = (department) => {
  return axios.request({
    url: '/cmdb2/v1/sql/objlist/',
    method: 'get',
    params: {
      department
    }
  })
}
export const getSqlobjlist = (department) => {
  return axios.request({
    url: '/cmdb2/v1/sql/Sqlobjlist/',
    method: 'get',
    params: {
      department
    }
  })
}
export const getSpoonobjlist = (department) => {
  return axios.request({
    url: '/cmdb2/v1/sql/Spoonobjlist/',
    method: 'get',
    params: {
      department
    }
  })
}
export const getimplement = (parameter,storage,targetKeys,flag) => {
  return axios.request({
    url: '/cmdb2/v1/sql/implement/',
    method: 'get',
    params: {
      parameter,
      storage,
      targetKeys,
      flag,
    }
  })
}
export const getimplement_spoon = (parameter,storage,targetKeys,todate) => {
  return axios.request({
    url: '/cmdb2/v1/sql/implement_spoon/',
    method: 'get',
    params: {
      parameter,
      storage,
      targetKeys,
      todate,
    }
  })
}

export const getimplement2 = (storage) => {
  return axios.request({
    url: '/cmdb2/v1/sql/implement2/',
    method: 'get',
    params: {
      storage,
    }
  })
}
export const getCase = (name) => {
  return axios.request({
    url: '/pb/v2/case/name/',
    method: 'get',
    params: {
      name
    }
  })
}
export const getname = () => {
  return axios.request({
    url: '/pb/v2/case/getname/',
    method: 'get',
    params: {}
  })
}
export const getSoftList2 = (key, value) => {
  return axios.request({
    url: '/pb/v2/case/userlist/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}
export const sqlDelete = (data) => {
  return axios.request({
    url: '/cmdb2/v1/sql/delete/',
    method: 'delete',
    data
  })
}

export const getCaseFile = (startdate, enddate) => {
  return axios.request({
    url: '/pb/v2/case/getfile/',
    method: 'get',
    params: {
      startdate,
      enddate
    }
  })
}

export const getSoftUpdateList2 = (key, value) => {
  return axios.request({
    url: '/pb/v2/case/username/',
    method: 'get',
    params: {
      key,
      value
    }
  })
}
