//导入request.js请求工具
import request from '@/utils/request.ts'


//提供调用登录接口的函数
export const userLoginService = (loginData)=>{
    const params = new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/login',params)
}


