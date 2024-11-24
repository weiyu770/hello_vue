<script setup>
// 引入必要的库和组件
import {useRouter} from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useTokenStore} from '@/stores/modules/token'; // 引入 Pinia store
import {userLogoutService} from '@/api/user/user.js'; // 引入用户退出接口
import {UserFilled, CaretBottom} from '@element-plus/icons-vue';

import {
    House,
    Promotion,
    Edit,
    DataAnalysis,
    Menu,
    Tickets,
    Histogram,
    User,
    Crop,
    EditPen
} from '@element-plus/icons-vue';


// 定义路由和用户退出逻辑
const router = useRouter();
const tokenStore = useTokenStore();

// 退出登录的处理函数
const handleLogout = () => {
    ElMessageBox.confirm('您确认要退出登录吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            // 调用后端退出接口
            userLogoutService()
                .then(() => {
                    console.log('退出接口调用成功');
                    // 清除前端 token 并跳转到登录页面
                    tokenStore.removeToken();
                    router.push('/login');
                    ElMessage({
                        type: 'success',
                        message: '退出登录成功',
                    });
                })
                .catch(error => {
                    console.error('退出接口调用失败:', error);
                    ElMessage({
                        type: 'error',
                        message: '退出失败，请稍后重试',
                    });
                });
        })
        .catch(() => {
            console.log('用户取消退出登录');
            ElMessage({
                type: 'info',
                message: '取消退出',
            });
        });
};
</script>

<template>
    <el-container class="layout-container">
        <!-- ======================== 左侧菜单区域 ======================== -->
        <el-aside width="200px">
            <!-- LOGO 部分 -->
            <div class="el-aside__logo"></div>

            <!-- 主菜单 -->
            <el-menu active-text-color="#ffd04b" background-color="#2c3e50" text-color="#fff" router>

                <!-- 首页菜单 -->
                <el-menu-item index="/home">
                    <el-icon>
                        <House/>
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>

                <!-- ======================== 文章管理部分 ======================== -->
                <el-sub-menu index="article/manage">
                    <template #title>
                        <el-icon>
                            <Promotion/>
                        </el-icon>
                        <span>文章管理</span>
                    </template>
                    <!-- 子菜单 -->
                    <el-menu-item index="/article/manage/post-article">
                        <el-icon>
                            <Edit/>
                        </el-icon>
                        <span>发布文章</span>
                    </el-menu-item>
                    <el-menu-item index="/article/manage/article-list">
                        <el-icon>
                            <Histogram/>
                        </el-icon>
                        <span>文章列表</span>
                    </el-menu-item>
                    <el-menu-item index="/article/manage/category">
                        <el-icon>
                            <Menu/>
                        </el-icon>
                        <span>分类管理</span>
                    </el-menu-item>
                    <el-menu-item index="/article/manage/tags">
                        <el-icon>
                            <Tickets/>
                        </el-icon>
                        <span>标签管理</span>
                    </el-menu-item>
                </el-sub-menu>

                <!-- ======================== 个人中心部分 ======================== -->
                <el-sub-menu index="user">
                    <template #title>
                        <el-icon>
                            <UserFilled/>
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User/>
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop/>
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen/>
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!-- ======================== 右侧主区域 ======================== -->
        <el-container>
            <!-- ======================== 顶部导航栏 ======================== -->
            <el-header class="header-container">
                <div class="header-title">后台管理系统</div>
                <!-- 用户操作 -->
                <el-dropdown @command="handleLogout">
          <span class="el-dropdown-link">
            <el-icon><UserFilled/></el-icon>
            用户名
            <el-icon><CaretBottom/></el-icon>
          </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>

            <!-- ======================== 内容显示区域 ======================== -->
            <el-main>
                <router-view></router-view>
            </el-main>

            <!-- ======================== 底部区域 ======================== -->
            <el-footer>后台管理系统 ©2023 By 韦宇</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
/* ======================== 主容器样式 ======================== */
.layout-container {
  height: 100vh;

  /* ======================== 左侧菜单样式 ======================== */
  .el-aside {
    background-color: #2c3e50; /* 左侧菜单背景颜色 */
    color: #fff; /* 菜单文字颜色 */

    &__logo {
      height: 120px;
      //background: url('@/assets/logo.png') no-repeat center / 100px auto; /* 左上角 logo 样式 */
      margin-bottom: 20px;
    }

    .el-menu {
      border-right: none; /* 去掉右侧边框 */

      .el-menu-item,
      .el-sub-menu__title {
        color: #c0c4cc; /* 菜单文字默认颜色 */
      }

      .el-menu-item:hover,
      .el-sub-menu__title:hover {
        color: #ffd04b; /* 悬停时的文字颜色 */
      }

      .is-active {
        background-color: #1f2d3d; /* 选中菜单项背景颜色 */
        color: #ffd04b; /* 选中菜单项文字颜色 */
      }

      .el-icon {
        font-size: 18px; /* 图标大小 */
        margin-right: 10px; /* 图标与文字的间距 */
      }
    }
  }

  /* ======================== 顶部导航栏样式 ======================== */
  .el-header {
    background-color: #fff; /* 顶部背景颜色 */
    display: flex;
    align-items: center;
    justify-content: space-between; /* 左右对齐 */
    padding: 0 20px;

    .header-title {
      font-size: 18px;
      font-weight: bold;
    }

    .el-dropdown-link {
      cursor: pointer;
      font-size: 16px;
      color: #333;
      display: flex;
      align-items: center;
    }

    .el-dropdown-link .el-icon {
      margin-left: 5px;
    }
  }

  /* ======================== 底部样式 ======================== */
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
