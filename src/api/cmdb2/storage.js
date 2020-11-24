import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const UploadUrl = baseUrl + '/cmdb2/v1/storage/upload/'

export const getstoragelist = (page, limit, key, value) => {
    return axios.request({
        url: '/cmdb2/v1/storage/storagelist/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const addstoragelist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/storage/storagelist/',
        method: 'post',
        data
    })
}

export const delstoragelist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/storage/storagelist/',
        method: 'delete',
        data
    })
}

export const updatestoragelist = (data) => {
    return axios.request({
        url: '/cmdb2/v1/storage/storagelist/',
        method: 'put',
        data
    })
}

export const storage_getid = () => {
    return axios.request({
        url: '/cmdb2/v1/storage/storage_getid/',
        method: 'get',
    })
}

export const storage_iddata = (name) => {
    return axios.request({
        url: '/cmdb2/v1/storage/storage_iddata/',
        method: 'get',
        params: {
            name
        }
    })
}
