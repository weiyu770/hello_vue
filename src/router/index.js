import { createRouter, createWebHistory } from 'vue-router';

// 导入登录组件
import LoginVue from '@/views/Login.vue';

// 定义路由
const routes = [
    { path: '/login', component: LoginVue },
    { path: '/', redirect: '/login' } // 根路径重定向到登录页面
];

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

// 导出路由
export default router;
