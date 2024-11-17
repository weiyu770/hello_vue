import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import LoginVue from '@/views/user/Login.vue';
import Layout from '@/views/Layout.vue'; // 引入 Layout 组件
import { useTokenStore } from '@/stores/modules/token';

// 子路由组件
import ArticleCategoryVue from '@/views/article/ArticleCategory.vue';
import ArticleManageVue from '@/views/article/ArticleManage.vue';
import UserInfoVue from '@/views/user/UserInfo.vue';
import UserAvatarVue from '@/views/user/UserAvatar.vue';
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue';

// 路由配置
const routes = [
    {
        path: '/login',
        component: LoginVue,
        name: 'Login', // 登录页面
    },
    {
        path: '/',
        component: Layout, // 直接将 Layout 设置为首页
        name: 'Layout',
        children: [
            {
                path: 'article/category',
                component: ArticleCategoryVue,
                name: 'ArticleCategory',
            },
            {
                path: 'article/manage',
                component: ArticleManageVue,
                name: 'ArticleManage',
            },
            {
                path: 'user/info',
                component: UserInfoVue,
                name: 'UserInfo',
            },
            {
                path: 'user/avatar',
                component: UserAvatarVue,
                name: 'UserAvatar',
            },
            {
                path: 'user/resetPassword',
                component: UserResetPasswordVue,
                name: 'UserResetPassword',
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login', // 未匹配的路径重定向到登录页面
    },
];

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局导航守卫：检查是否登录
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore();
  // 如果用户未登录并且访问的不是登录页面，则重定向到登录页面
  if (!tokenStore.isLoggedIn() && to.path !== '/login') {
    ElMessage.warning('未登录，为你跳转到登录页面');
    next({ path: '/login' }); // 跳转到登录页面
  } else {
    next(); // 已登录，允许访问
  }
});

export default router;
