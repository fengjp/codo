import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/mg/v2/accounts/peoplelist/upload/'

export const getpeoplelist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/peoplelist/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const addpeoplelist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/peoplelist/',
        method: 'post',
        data
    })
}

export const delpeoplelist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/peoplelist/',
        method: 'delete',
        data
    })
}

export const updatepeoplelist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/peoplelist/',
        method: 'put',
        data
    })
}

export const getlist = () => {
    return axios.request({
        url: '/mg/v2/accounts/getlist/',
        method: 'get',
    })
}
