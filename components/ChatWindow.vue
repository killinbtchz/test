<template>
  <div class="chat-window">
    <h3>{{ chat.name }}</h3>
    <div class="messages">
      <div v-for="message in chat.messages" :key="message.id">
        <strong>{{ message.sender }}:</strong> {{ message.text }}
      </div>
    </div>
    <input 
      v-model="newMessage" 
      @keyup.enter="sendMessage" 
      placeholder="Type a message..." 
    />
  </div>
</template>

<script>
export default {
  name: "ChatWindow",
  props: {
    chat: Object,
    socket: Object,   
    username: String, 
  },
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: this.username,
      text: this.newMessage,
    };

    this.chat.messages.push(message);
    this.socket.emit("chat message", {
      text: this.newMessage,
      receiver: this.chat.name,
      sender: this.username,
    });

    this.newMessage = "";
  },
},
};
</script>

<style scoped>
.chat-window {
  padding: 16px;
  height: calc(100vh - 60px);
}
.chat-window .messages {
  max-height: 300px;
  overflow-y: auto;
}
.chat-window input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 10px;
}
</style>
