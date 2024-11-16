import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // ElementPlus 的中文语言包

//@ts-ignore
import App from './App.vue';
//@ts-ignore
import router from './router'; // 路由配置文件
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

// 使用 ElementPlus 并设置语言
app.use(ElementPlus, { locale: zhCn });
app.use(router); // 启用路由
app.use(pinia);  // 启用 Pinia 状态管理

app.mount('#app'); // 挂载 Vue 实例到 #app
