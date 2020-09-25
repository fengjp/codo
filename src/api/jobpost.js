import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/mg/v2/accounts/postlist/upload/'

export const getpostlist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/postlist/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const addpostlist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/postlist/',
        method: 'post',
        data
    })
}

export const delpostlist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/postlist/',
        method: 'delete',
        data
    })
}

export const updatepostlist = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/postlist/',
        method: 'put',
        data
    })
}

export const post_getid = () => {
    return axios.request({
        url: '/mg/v2/accounts/post_getid/',
        method: 'get',
    })
}
