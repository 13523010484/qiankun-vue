// src/api.js
import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // URL 前缀，可以在 .env 文件中配置
  timeout: 5000 // 请求超时时间
  // 其他 Axios 配置...
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在这里可以添加一些请求前的逻辑，比如添加 token 到 headers
    // config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么，比如统一处理错误码等
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
