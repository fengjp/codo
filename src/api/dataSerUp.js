import axios from '@/libs/api.request'


export const getCertdata = (key, date = ['', '']) => {
  return axios.request({
    url: '/tk/v1/getcertdata/',
    method: 'get',
    params: {
      key,
      start_date: date[0],
      end_date: date.length > 1 ? date[1] : ''
    }
  })
}

