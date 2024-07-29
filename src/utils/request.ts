import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

declare global {
  interface Window {
  }
}

const origin = window.location.origin

const client = Axios.create({
  baseURL: origin + '/api',
  timeout: 0
})

client.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  return config;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

client.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response;
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  console.log('网络异常');
  return Promise.reject(error);
});



export async function request<T>(url: string, config?: AxiosRequestConfig, onSuccess?: Function) {
  return new Promise(async (resolve, reject) => {
    try {
      const response: AxiosResponse<T> = await client.request({
        url,
        ...config
      })
      resolve(response)
      onSuccess && onSuccess()
    } catch (error) {
      reject(error)
    }
  })
}