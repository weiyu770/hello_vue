/**
 * @description: 路由配置文件
 * @path: D:\备份\自己用的测试\my-vue\src\router\index.js
 * @author: yu_wei
 * @create: 2024/11/18 21:05
 */
import {createRouter, createWebHistory} from 'vue-router';
import {ElMessage} from 'element-plus';
import LoginVue from '@/views/user/Login.vue';
import Layout from '@/views/Layout.vue'; // 引入 Layout 组件
import HomeVue from '@/views/Home.vue'; // 引入首页组件
import {useTokenStore} from '@/stores/modules/token';

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
        component: Layout, // 将 Layout 设置为首页
        name: 'Layout',
        children: [
            {
                path: 'home',
                component: HomeVue, // 首页组件
                name: 'Home',
                meta: {title: '首页'},
            },
            {
                path: 'article/category',
                component: ArticleCategoryVue,
                name: 'ArticleCategory',
                meta: {title: '文章分类'},
            },
            {
                path: 'article/manage',
                component: ArticleManageVue,
                name: 'ArticleManage',
                meta: {title: '文章管理'},
            },
            {
                path: 'user/info',
                component: UserInfoVue,
                name: 'UserInfo',
                meta: {title: '用户信息'},
            },
            {
                path: 'user/avatar',
                component: UserAvatarVue,
                name: 'UserAvatar',
                meta: {title: '修改头像'},
            },
            {
                path: 'user/resetPassword',
                component: UserResetPasswordVue,
                name: 'UserResetPassword',
                meta: {title: '重置密码'},
            },
            {
                path: 'article/manage/post-article',
                name: 'PostArticle',
                component: () => import('@/views/article/PostArticle.vue'),
                meta: {title: '发布文章'},
            },
            {
                path: 'article/manage/article-list',
                name: 'ArticleList',
                component: () => import('@/views/article/ArticleList.vue'),
                meta: {title: '文章列表'},
            },
            {
                path: 'article/manage/category',
                name: 'CategoryManage',
                component: () => import('@/views/article/CategoryManage.vue'),
                meta: {title: '分类管理'},
            },
            {
                path: 'article/manage/tags',
                name: 'TagsManage',
                component: () => import('@/views/article/TagsManage.vue'),
                meta: {title: '标签管理'},
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
        ElMessage.warning('未登录，将重定向到登录页面');
        next({path: '/login'}); // 跳到登录页面
    } else {
        next(); // 已登录，允许访问
    }
});

export default router;
