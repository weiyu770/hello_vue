<script setup>
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useTokenStore } from '@/stores/modules/token'; // 引入 Pinia store
import { userLogoutService } from '@/api/user/user.js'; // 引入用户退出接口
import { UserFilled, CaretBottom } from '@element-plus/icons-vue';

const router = useRouter();
const tokenStore = useTokenStore();

// 退出登录处理函数
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
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
        <el-menu-item index="/article/category">
          <el-icon>
            <Management />
          </el-icon>
          <span>文章分型</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu>
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetPassword">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header class="header-container">
        <div class="header-title">后台管理系统</div>
        <!-- 用户操作 -->
        <el-dropdown @command="handleLogout">
          <span class="el-dropdown-link">
            <el-icon><UserFilled /></el-icon>
            用户名
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>

      <!-- 底部区域 -->
      <el-footer>后台管理系统 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between; /* 两边对齐 */
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

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
