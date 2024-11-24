/**
 * @description: Token store
 * @path: D:\备份\自己用的测试\my-vue\src\stores\modules\token.ts
 * @author: yu_wei
 * @create: 2024/11/18 21:05
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTokenStore = defineStore('token', () => {
  const token = ref(localStorage.getItem('token') || ''); // 初始化时从 localStorage 获取 token

  // 设置 token，并保存到 localStorage
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
