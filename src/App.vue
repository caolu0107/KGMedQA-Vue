<template>
  <div id="app">
    <div class="header">
      <div class="user-bubble" @click="toggleDropdown">
        {{ getUsernameInitials }}
        <div v-if="showDropdown" class="dropdown-menu">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    getUsernameInitials() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.username) {
        return user.username.substring(0, 2).toUpperCase();
      }
      return '';
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  mounted() {
    document.title = '智能医药问答系统';
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.header {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.user-bubble {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  background-color: #007BFF;
  color: white;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 50px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.dropdown-menu button {
  padding: 10px;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background-color: #f0f0f0;
}
</style>
