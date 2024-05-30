<template>
  <div class="login-container">
    <div class="login-box">
      <h1>{{ isLogin ? '登录' : '注册' }}</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="username">用户名</label>
          <input v-model="username" id="username" type="text" required>
        </div>
        <div class="input-group" v-if="!isLogin">
          <label for="email">邮箱</label>
          <input v-model="email" id="email" type="email" required>
        </div>
        <div class="input-group">
          <label for="password">密码</label>
          <input v-model="password" id="password" type="password" required>
        </div>
        <div class="input-group" v-if="!isLogin">
          <label for="confirmPassword">确认密码</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" required>
        </div>
        <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
        <button type="button" @click="toggleForm">{{ isLogin ? '没有账号 去注册' : '已有帐号 去登陆' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLogin: true,
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.clearForm();
    },
    clearForm() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    },
    async handleSubmit() {
      try {
        if (!this.isLogin && this.password !== this.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        const endpoint = this.isLogin
          ? 'http://127.0.0.1:5000/api/login'
          : 'http://127.0.0.1:5000/api/register';

        const payload = this.isLogin
          ? { username: this.username, password: this.password }
          : { username: this.username, email: this.email, password: this.password };

        const response = await axios.post(endpoint, payload);

        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify({ username: this.username }));
          this.$router.push('/chat');
        } else {
          alert(response.data.message); // 显示错误信息
        }
      } catch (error) {
        alert('Request failed: ' + (error.response ? error.response.data.message : error.message));
      }
    }
  }
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: left;
}

form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.input-group input {
  padding: 8px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button + button {
  margin-top: 10px;
  background-color: #6c757d;
}
</style>
