import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import LoginVue from '@/views/Login.vue';
import HelloWorld from '@/views/HelloWorld.vue';
import { useTokenStore } from '@/stores/modules/token';

const routes = [
    { path: '/login', component: LoginVue },
    { path: '/hello-world', component: HelloWorld },
    { path: '/', redirect: '/hello-world' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 全局导航守卫：检查是否登录
router.beforeEach((to, from, next) => {
    const tokenStore = useTokenStore();

    // 如果用户未登录并且访问的不是登录页面，则重定向到登录页面
    if (!tokenStore.isLoggedIn() && to.path !== '/login') {
        ElMessage.warning('未登录 为你跳转到登录页面');
        next({ path: '/login' });
    } else {
        next(); // 已登录，允许访问
    }
});

export default router;
