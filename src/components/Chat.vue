<template>
    <div class="chat-container">
      <div class="messages">
        <div
          class="message"
          v-for="(message, index) in messages"
          :key="index"
          :class="{'user-message': message.user, 'bot-message': !message.user}"
        >
          <div class="message-content">
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
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: '',
        suggestions: ['乳腺癌的症状有哪些？', '最近老流鼻涕怎么办？', '为什么有的人会失眠？', '鹅肉有什么好处？']
      };
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          const userMessage = { text: this.newMessage, user: true };
          this.messages.push(userMessage);
          
          axios.post('/api/send_message', { message: this.newMessage })
            .then(response => {
              const botResponse = { text: response.data.response, user: false };
              this.messages.push(botResponse);
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
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 75%;
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
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
  }
  
  .input-area {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #e0e0e0;
    background-color: #fff;
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
  }
  
  .suggestion-button:hover {
    background-color: #0056b3;
  }
  
  .input-container {
    display: flex;
    padding: 10px;
    background-color: #fff;
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
  }
  
  .send-button:hover {
    background-color: #0056b3;
  }
  </style>
  