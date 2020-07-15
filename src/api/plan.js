import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro


export const getPlanList = (page, limit,key, value, isExport=false) => {
    return axios.request({
        url: '/pb/v2/plan/list/',
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

export const PlanAdd = (data, meth) => {
    return axios.request({
        url: '/pb/v2/plan/add/',
        method: meth,
        data
    })
}

export const getPlan = (name) => {
    return axios.request({
        url: '/pb/v2/plan/name/',
        method: 'get',
        params: {
            name
        }
    });
};
export const getname = () => {
    return axios.request({
        url: '/pb/v2/plan/getname/',
        method: 'get',
        params: {}
    });
};
export const getSoftList2 = (key,value) => {
    return axios.request({
        url: '/pb/v2/plan/userlist/',
        method: 'get',
        params: {
            key,
            value,
        }
    });
};
export const planDelete = (data) => {
    return axios.request({
        url: '/pb/v2/plan/delete/',
        method: 'delete',
        data
    })
};

export const getPlanFile = (startdate,enddate) => {
    return axios.request({
        url: '/pb/v2/plan/getfile/',
        method: 'get',
        params: {
            startdate,
            enddate,
        }
    })
};

export const getSoftUpdateList2 = (key,value) => {
    return axios.request({
        url: '/pb/v2/plan/username/',
        method: 'get',
        params: {
            key,
            value,
        }
    });
};
