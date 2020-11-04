import axios from 'axios'
import { Message, Notice } from 'view-design'
import Vue from 'vue'
import Cookies from 'js-cookie'
import { setToken } from '@/libs/util'
// import { router } from '@/router'

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                // 添加xsrf验证
                'X-Xsrftoken': Cookies.get('_xsrf')
            }
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
                // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // Spin.show() // 不建议开启，因为界面不友好
                }
                this.queue[url] = true
                return config
            }, error => {
                return Promise.reject(error)
            })
            // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const { data, status, request } = res
            // console.log( { data, status })
            return { data, status, request }
        }, error => {
            this.destroy(url)
            if (error.response.status === '401' || error.response.status === 401) {
                Notice.error({
                    title: '登录验证失败',
                    desc: `已被强制下线，请重新登录`
                })
                // setToken('')
                // location.reload()
                setTimeout(() =>{
                  setToken('')
                  location.reload()
                },2000);
            } else if (error.response.status === 402) {
                console.log(error.response)
                Notice.warning({
                    title: '不要重复提交',
                    desc: `请尝试刷新下页面，状态码-${error.response.status}`
                })
            } else if (error.response.status === 403) {
                console.log(error.response)
                Notice.warning({
                    title: '你没有权限，请联系管理员',
                    desc: `${error.response.data}`
                })
            } else if (error.response.status === 500) {
                Notice.error({
                    title: '服务内部错误，请联系管理员',
                    desc: `${error.response.data}`
                })
            } else {
                Notice.error({
                    title: '发生错误',
                    desc: `状态码-${error.response.status}`,
                })
            }
            return Promise.reject(error)
        })
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest
