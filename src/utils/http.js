import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Toast } from 'mint-ui';
import router from '../router'

/**
 * http 请求工具类
 *
 * 请求拦截器 负责将客户端标识token值存储并放置在头部提交给服务端
 *
 * 相应拦截器 负责全局处理业务请求的网络或业务错误
 **/
// 创建axios实例
const service = axios.create({
  timeout: 10000 // 超时时间
});

// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token; // 存储token
      // console.log("请求token",sessionStorage.login_token);
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    let errMsg = '';
    if (err && err.response.status) {
      switch (err.response.status) {
      case 302:
        errMsg = '登录状态过期';
        // 返回登录页
        router.push('/login');
      case 401:
        errMsg = '未授权';
        // 返回登录页
        router.push('/login');
        break;
      case 403:
        errMsg = '禁止访问';
        break;
      case 408:
        errMsg = '请求超时';
        break;
      case 500:
        errMsg = '服务器内部错误';
        break;
      case 501:
        errMsg = '服务未实现';
        break;
      case 502:
        errMsg = '网关错误';
        break;
      case 503:
        errMsg = '服务不可用';
        break;
      case 504:
        errMsg = '网关超时';
        break;
      case 505:
        errMsg = 'HTTP版本不受支持';
        break;
      default:
        errMsg = "网络连接错误";
        break
      }
    } else {
      errMsg = "网络连接错误";
    }
    Toast({
      message: errMsg,
      position: 'middle',
    });
    return Promise.reject(errMsg)
  }
);

export default service
