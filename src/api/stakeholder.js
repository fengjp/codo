import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/mg/v2/accounts/stakeholder/upload/'

export const getStakeholderList = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/stakeholder/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}
export const getList = (key,value) => {
    return axios.request({
        url: '/pb/v2/case/demanderlist/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}
export const geturl = () => {
    return axios.request({
        url: '/pb/v2/case/geturl/',
        method: 'get',
    })
}
export const newStakeholder = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/stakeholder/',
        method: 'post',
        data
    })
}

export const delStakeholder = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/stakeholder/',
        method: 'delete',
        data
    })
}

export const updateStakeholder = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/stakeholder/',
        method: 'put',
        data
    })
}
