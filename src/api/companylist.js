import axios from '@/libs/api.request'

export const getCompany = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/accounts/company/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}
export const getList = (value) => {
    return axios.request({
        url: '/mg/v2/accounts/stakeholderlist/',
        method: 'get',
        params: {
            value
        }
    })
}

export const getcaseList = (key,value) => {
    return axios.request({
        url: '/pb/v2/case/demanderlist/',
        method: 'get',
        params: {
            key,
            value
        }
    })
}
export const newCompany = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/company/',
        method: 'post',
        data
    })
}

export const delCompany = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/company/',
        method: 'delete',
        data
    })
}

export const updateCompany = (data) => {
    return axios.request({
        url: '/mg/v2/accounts/company/',
        method: 'put',
        data
    })
}
