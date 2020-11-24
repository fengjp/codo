import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/cmdb2/v1/record/upload/'

export const getstoragelist = (page, limit, key, value) => {
    return axios.request({
        url: '/cmdb2/v1/record/recordlist/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const addrecordlist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/record/recordlist/',
        method: 'post',
        data
    })
}

export const delrecordlist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/record/recordlist/',
        method: 'delete',
        data
    })
}

export const updaterecordlist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/record/recordlist/',
        method: 'put',
        data
    })
}

export const record_getid = () => {
    return axios.request({
        url: '/cmdb2/v1/record/record_getid/',
        method: 'get',
    })
}


export const record_getdata = (username,tablename) => {
    return axios.request({
        url: '/cmdb2/v1/record/record_getdata/',
        method: 'get',
        params: {
            username,
            tablename,
        }
    })
}
