<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { userLoginService } from '/src/api/user.js';
import { useTokenStore } from '@/stores/modules/token';

// 初始化路由和状态管理
const router = useRouter();
const tokenStore = useTokenStore();

// 定义数据模型，供用户输入用户名和密码
const loginData = ref({
    userName: 'admin', // 默认值为 'admin'
    passWord: '123456', // 默认值为 '123456'
});

// 定义表单校验规则
const rules = {
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' },
    ],
    passWord: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    ],
};

// 引用表单实例
const form = ref(null);

// 登录函数
const login = async () => {
    try {
        const token = await userLoginService(loginData.value);
        console.log('登录请求响应 - 返回结果:', token);

        if (token) {
            ElMessage.success('登录成功');
            tokenStore.setToken(token); // 存储 token
            router.push('/'); // 跳转到首页Layout.vue
        } else {
            ElMessage.error('登录失败，未返回有效的 token');
        }
    } catch (error) {
        ElMessage.error('登录过程中发生异常，请稍后再试');
    }
};

// 提交表单时校验并登录
const handleSubmit = () => {
    form.value.validate(async (valid) => {
        if (valid) {
            await login(); // 校验通过后调用登录函数
        } else {
            ElMessage.error('请检查输入内容是否正确');
        }
    });
};


//定义一个清空数据的函数
const clearData = () => {
    loginData.value.userName = '';
    loginData.value.passWord = '';
};



</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 登录表单 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                :model="loginData"
                :rules="rules"
            >
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>

                <!-- 用户名输入框 -->
                <el-form-item prop="userName">
                    <el-input
                        v-model="loginData.userName"
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                    ></el-input>
                </el-form-item>

                <!-- 密码输入框 -->
                <el-form-item prop="passWord">
                    <el-input
                        v-model="loginData.passWord"
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                    ></el-input>
                </el-form-item>

                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button
                        class="button"
                        type="primary"
                        auto-insert-space
                        @click="handleSubmit"
                    >
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
        background:
            //url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
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
