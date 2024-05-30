<template>
  <div class="container">
    <div class="sidebar">
      <div class="sidebar-header">
        <button class="new-topic-button" @click="promptNewTopic">创建一个新话题</button>
      </div>
      <div class="sidebar-content">
        <ul>
          <li
            v-for="(topic, index) in topics"
            :key="index"
            :class="{ 'active-topic': index === currentTopicIndex }"
            @click="loadTopic(index)"
            @mouseover="hoverTopic(index)"
            @mouseout="leaveTopic(index)"
          >
            {{ topic.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-container">
      <div class="messages">
        <div
          class="message"
          v-for="(message, index) in messages"
          :key="index"
          :class="{'user-message': message.user, 'bot-message': !message.user}"
        >
          <div class="message-content">
            <div v-if="!message.user" class="avatar">
              <img src="/bot_avatar.png" alt="Bot Avatar" />
            </div>
            <div class="message-text">{{ message.text }}</div>
          </div>
        </div>
      </div>
      <div class="input-area">
        <div class="suggestions">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-button"
            @click="addSuggestionToInput(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
        <div class="input-container">
          <button @click="startVoiceRecognition" class="voice-button">🎤</button>
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="请输入您的问题..."
            class="message-input"
            ref="messageInput"
          />
          <button @click="sendMessage" class="send-button">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      messages: [],
      newMessage: '',
      suggestions: ['肝病要吃啥药？', '哪些人最好不好吃蜂蜜？', '全血细胞计数能查出啥来？', '怎样才能预防肾虚？'],
      topics: [],
      currentTopicIndex: null,
      hoveredTopicIndex: null,
      recognition: null, // 保存语音识别对象
    };
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        const userMessage = { text: this.newMessage, user: true };
        this.messages.push(userMessage);

        axios.post('http://127.0.0.1:5000/api/send_message', { message: this.newMessage, topicId: this.topics[this.currentTopicIndex].id })
          .then(response => {
            const botResponse = { text: response.data.response, user: false };
            this.messages.push(botResponse);
            this.saveMessages();
          })
          .catch(error => {
            console.error('Error sending message:', error);
          });

        this.newMessage = '';
      }
    },
    addSuggestionToInput(suggestion) {
      this.newMessage = suggestion;
      this.$refs.messageInput.focus();
    },
    async promptNewTopic() {
      const topicName = prompt("请为新话题命名:");
      if (topicName) {
        await this.createNewTopic(topicName);
      }
    },
    async createNewTopic(topicName) {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post('http://127.0.0.1:5000/api/create_topic', { name: topicName, username: user.username });
      this.topics.push(response.data.topic);
      this.currentTopicIndex = this.topics.length - 1;
      this.messages = [];
    },
    async loadTopic(index) {
      this.currentTopicIndex = index;
      const response = await axios.get(`http://127.0.0.1:5000/api/get_messages?topicId=${this.topics[index].id}`);
      this.messages = response.data.messages;
    },
    saveMessages() {
      const topicId = this.topics[this.currentTopicIndex].id;
      axios.post('http://127.0.0.1:5000/api/save_messages', { topicId, messages: this.messages });
    },
    hoverTopic(index) {
      this.hoveredTopicIndex = index;
    },
    leaveTopic(index) {
      if (this.hoveredTopicIndex === index) {
        this.hoveredTopicIndex = null;
      }
    },
    startVoiceRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Sorry, your browser does not support speech recognition.');
        return;
      }
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'zh-CN'; // 设置为中文
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.newMessage = transcript;
        this.sendMessage();
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition service disconnected');
      };

      this.recognition.start();
    },
    async mounted() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const response = await axios.get(`http://127.0.0.1:5000/api/get_topics?username=${user.username}`);
        this.topics = response.data.topics;
        this.promptNewTopic();  // Always prompt for new topic on login
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.sidebar {
  width: 250px;
  background-color: #f4f4f4;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  border-radius: 10px 0 0 10px;
}

.sidebar-header {
  padding: 10px;
  display: flex;
  justify-content: center;
}

.new-topic-button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.new-topic-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.sidebar-content {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.sidebar-content ul {
  list-style-type: none;
  padding: 0;
}

.sidebar-content li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  border-radius: 5px;
  margin-bottom: 5px;
}

.sidebar-content li:hover {
  background-color: #ddd;
  transform: scale(1.05);
}

.active-topic {
  background-color: #007BFF;
  color: white;
  font-weight: bold;
  transform: scale(1.05);
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 75%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 0 10px 10px 0;
  background-color: #f9f9f9;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 10px;
  margin-left: 20px; /* 增加左边距，使聊天框整体向右移动 */
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  position: relative;
  text-align: left;
}

.user-message .message-content {
  background-color: #007BFF;
  color: white;
  border-bottom-right-radius: 0;
}

.bot-message .message-content {
  background-color: #e0e0e0;
  color: black;
  border-bottom-left-radius: 0;
}

.message-text {
  word-wrap: break-word;
  margin-left: 10px;
  margin-right: 10px;
}

.avatar {
  position: absolute;
  top: 0;
  left: -35px;
  width: 30px;
  height: 30px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}

.input-area {
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.suggestion-button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.3s;
}

.suggestion-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.input-container {
  display: flex;
  padding: 10px;
}

.voice-button {
  padding: 10px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  cursor: pointer;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-right: 10px;
  outline: none;
}

.send-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.send-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
