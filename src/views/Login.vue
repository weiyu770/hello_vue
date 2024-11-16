<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userLoginService } from '/src/api/user.js'
import { useRouter } from 'vue-router'
import { useTokenStore } from "@/stores/modules/token"

const router = useRouter()
const tokenStore = useTokenStore()

// 定义数据模型，供用户输入用户名和密码
const loginData = ref({
    userName: 'root',  // 可以设置默认值为 'root'
    passWord: '123456'  // 可以设置默认值为 '123456'
})

// 登录函数
const login = async () => {
    try {
        const token = await userLoginService(loginData.value);
        console.log("登录请求响应 - 返回结果:", token);

        if (token) {  // 如果 token 存在，表示登录成功
            ElMessage.success('登录成功');
            tokenStore.setToken(token);  // 将 token 存储
            router.push('/');  // 跳转到首页
        } else {
            ElMessage.error('登录失败，未返回有效的 token');
        }
    } catch (error) {
        ElMessage.error('登录过程中发生异常，请稍后再试');
    }
};




</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="userName">
                    <el-input
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        v-model="loginData.userName">
                    </el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginData.passWord">
                    </el-input>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button
                        class="button"
                        type="primary"
                        auto-insert-space
                        @click="login">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
        url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .button {
            width: 100%;
        }
    }
}
</style>
