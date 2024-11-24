/**
 * @description: 请求配置工具
 * @path: D:\备份\自己用的测试\my-vue\src\utils\request.ts
 * @author: yu_wei
 * @create: 2024/11/18 21:05
 */

import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {ElMessage} from 'element-plus';
import {useTokenStore} from '@/stores/modules/token';

//@ts-ignore
import router from '@/router';

const baseURL = '/api';
const instance: AxiosInstance = axios.create({baseURL});

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 返回 response.data，确保前端拿到的是实际的数据对象
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            ElMessage.error('请先登录');
            router.push('/login');
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(error);
    }
);

export default instance;
