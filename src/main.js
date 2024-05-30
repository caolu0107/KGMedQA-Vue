import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:5000';

const app = createApp(App);
app.use(router);
app.mount('#app');

document.title = '智能医药问答系统'; // 设置标签页名称
