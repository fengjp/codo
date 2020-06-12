import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro


export const getCaseList = (page, limit, key, value, date = ['', '']) => {
    return axios.request({
        url: '/pb/v2/case/list/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value,
            start_date: date[0],
            end_date: date.length > 1 ? date[1] : ''
        }
    })
}

export const CaseAdd = (data, meth) => {
    return axios.request({
        url: '/pb/v2/case/add/',
        method: meth,
        data
    })
}

export const getCase = (name) => {
    return axios.request({
        url: '/pb/v2/case/name/',
        method: 'get',
        params: {
            name
        }
    });
};
export const getname = () => {
    return axios.request({
        url: '/pb/v2/case/getname/',
        method: 'get',
        params: {}
    });
};
export const getSoftList2 = (key,value) => {
    return axios.request({
        url: '/pb/v2/case/userlist/',
        method: 'get',
        params: {
            key,
            value,
        }
    });
};
export const getSoftUpdateList2 = (key,value) => {
    return axios.request({
        url: '/pb/v2/case/username/',
        method: 'get',
        params: {
            key,
            value,
        }
    });
};
