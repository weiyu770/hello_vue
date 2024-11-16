import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore('token', () => {
    // 定义响应式的 token
    const token = ref(localStorage.getItem('token') || ''); // 初始化时从 localStorage 获取 token

    // 设置 token，并保存到 localStorage
// Fix the type error in the setToken function
    const setToken = (newToken: string) => {
        token.value = newToken;
        localStorage.setItem('token', newToken); // 持久化到 localStorage
    };

    // 移除 token，并清空 localStorage
    const removeToken = () => {
        token.value = '';
        localStorage.removeItem('token'); // 从 localStorage 中移除
    };

    // 检查是否已登录
    const isLoggedIn = () => {
        return !!token.value; // 如果 token 存在则返回 true
    };

    return {
        token,
        setToken,
        removeToken,
        isLoggedIn,
    };
});
