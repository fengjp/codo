import axios from '@/libs/api.request'
import config from '@/config'

export const grafana_Bearer = () => {
  return axios.request({
    url: 'http://192.168.79.100:3000/?orgId=1',
    method: 'get',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJrIjoiQ3diMHZ0UElYNW45R2I2cnlXd1lWWUtHVTE4RGdjRlAiLCJuIjoiYWEiLCJpZCI6MX0 ="
    },

  })
}

