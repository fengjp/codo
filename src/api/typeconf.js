import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/pb/v2/accounts/typeList/upload/'

export const gettypeList = (page, limit, key, value) => {
    return axios.request({
        url: '/pb/v2/accounts/typeList/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const addtypeList = (data) => {
    return axios.request({
        url: '/pb/v2/accounts/typeList/',
        method: 'post',
        data
    })
}

export const deltypeList = (data) => {
    return axios.request({
        url: '/pb/v2/accounts/typeList/',
        method: 'delete',
        data
    })
}

export const updatetypeList = (data) => {
    return axios.request({
        url: '/pb/v2/accounts/typeList/',
        method: 'put',
        data
    })
}

export const gettypedata = (value) => {
    return axios.request({
        url: '/pb/v2/accounts/typedata/',
        method: 'get',
        params: {
            value
        }
    })
}
