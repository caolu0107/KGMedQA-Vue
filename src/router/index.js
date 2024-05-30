import { createRouter, createWebHistory } from 'vue-router';
import Chat from '../components/Chat.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user'); // 检查本地存储中是否有用户信息
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
