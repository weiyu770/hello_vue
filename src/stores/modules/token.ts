// stores/modules/token.js 或 token.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore('token', () => {
    const token = ref('');

    const setToken = (newToken: string) => {
        token.value = newToken;
    };

    const removeToken = () => {
        token.value = '';
    };

    // 检查是否已登录
    const isLoggedIn = () => {
        return !!token.value;  // 如果 token 存在则返回 true
    };

    return {
        token,
        setToken,
        removeToken,
        isLoggedIn
    };
}, {
    persist: true
});
