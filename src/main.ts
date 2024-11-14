import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-ignore
import App from './App.vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn'; // 使用 ElementPlus 的中文语言包

const app = createApp(App);
app.use(ElementPlus, { locale: zhCn });
app.use(router); // 使用路由
app.mount('#app');



//@ts-ignore
import router from './router'; // 确保路径是相对路径 './router'
