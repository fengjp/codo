import axios from '@/libs/api.request'


export const getCertdata = (key) => {
  return axios.request({
    url: '/tk/v1/getcertdata/',
    method: 'get',
    params: {
      key
    }
  })
}

