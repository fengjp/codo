import axios from '@/libs/api.request'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro


export const getTree = () => {
    return axios.request({
        url: '/cmdb/v1/cmdb/sys_tree/?isMonitor=1',
        method: 'get',
    })
}

export const getCard = (key,value) => {
    return axios.request({
        url: '/tk/v1/monitor/serInfo/',
        method: 'get',
        params: {
            key,
            value,
        }
    });
};
