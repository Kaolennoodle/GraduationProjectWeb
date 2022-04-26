import axios from 'axios'
import router from "@/router";
import El from "element-ui/src/locale/lang/el";
import ElementUI from "element-ui";

const request = axios.create({
    baseURL: 'http://localhost:8081',
    timeout: 5000
})

// request 拦截器
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}

    if (user)
        config.headers['token'] = user.token;  // 设置请求头
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }

        //登录失效时给出提示
        if (res.code === '401') {
            ElementUI.Message({
                message: res.msg,
                type: 'error'
            })
            router.push('/login')
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)


export default request

