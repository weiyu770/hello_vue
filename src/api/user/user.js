// 导入请求工具
import request from '@/utils/request.ts';

/**
 * 用户登录
 */
export const userLoginService = (loginData) => {
    return request.post('/login', loginData)
        .then(response => {
            console.log("后端响应:", response.data);
            return response.data;  // 确保返回 response.data 而不是整个 response
        })
        .catch(error => {
            console.error("失败:", error); //
            throw error;
        });
};

/**
 * 用户退出
 */
export const userLogoutService = () => {
    return request.get('/logout')
        .then(response => {
            console.log("退出信息:", response.data); // 确认退出成功消息
            return response.data;  // 返回后端返回的结果
        })
        .catch(error => {
            console.error("退出请求失败:", error); // 输出详细错误信息
            throw error; // 抛出错误以便在前端捕获
        });
};
