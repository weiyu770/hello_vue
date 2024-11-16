//导入request.js请求工具
import request from '@/utils/request.ts'


//提供调用登录接口的函数
// export const userLoginService = (loginData)=>{
//     const params = new URLSearchParams();
//     for(let key in loginData){
//         params.append(key,loginData[key])
//     }
//     return request.post('/login',params)
// }
//
//
// user.js 中的 userLoginService
export const userLoginService = (loginData) => {
    return request.post('/login', loginData)
        .then(response => {
            console.log("后端响应数据:", response.data); // 确认数据结构
            return response.data;  // 确保返回 response.data 而不是整个 response
        })
        .catch(error => {
            console.error("请求失败:", error); // 输出详细错误信息
            throw error; // 抛出错误以便在 login 函数中捕获
        });
};
