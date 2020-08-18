import axios from '@/libs/api.request'

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
