<template>
  <div class="app">
    <Sidebar />
    <div class="content">
      <h2>hello!</h2>
      <h2>wazzyp</h2>
      <button @click="createChat">Создать чат</button>
      <ChatList :chats="chats" @chat-selected="setSelectedChat" />
      <ChatWindow
        v-if="selectedChat"
        :chat="selectedChat"
        :socket="socket" 
        :username="username"
      />
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Sidebar from "@/components/Sidebar.vue";
import ChatList from "@/components/ChatList.vue";
import ChatWindow from "@/components/ChatWindow.vue";

export default {
  name: "Messages",
  components: {
    Sidebar,
    ChatList,
    ChatWindow,
  },
  data() {
    return {
    socket: null,
    username: prompt("Введите ваше имя") || "Гость",
    chats: [],
    selectedChat: null,
    toast: null,
  };
  },
  methods: {
    setSelectedChat(chat) {
      this.selectedChat = chat;
    },
    createChat() {
    const username = prompt("Введите имя собеседника:");
    if (!username) return;

    if (!this.chats.find((c) => c.name === username)) {
      this.chats.push({
        id: Date.now(),
        name: username,
        messages: [],
      });
    }
  },
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("Connected ID:", this.socket.id);
    });

    this.socket.emit("logged_in", { username: this.username });

    this.socket.on("previousMessages", (messages) => {
      console.log("Received previous messages:", messages);

    });
    this.socket.on("previousMessages", (messages) => {

      messages.forEach(msg => {
        const interlocutor = (msg.sender === this.username) ? msg.receiver : msg.sender;

        let chat = this.chats.find(c => c.name === interlocutor);
        if (!chat) {
          chat = {
            id: Date.now() + Math.random(),
            name: interlocutor,
            messages: [],
          };
          this.chats.push(chat);
        }
        chat.messages.push({
          id: msg._id,
          sender: msg.sender,
          text: msg.text,
        });
      });
    });

    this.socket.on("chat message", (data) => {
      const interlocutor = data.sender;
      let chat = this.chats.find(c => c.name === interlocutor);
      if (!chat) {
        chat = {
          id: Date.now() + Math.random(),
          name: interlocutor,
          messages: [],
        };
        this.chats.push(chat);
      }
      chat.messages.push({
        id: Date.now(),
        sender: data.sender,
        text: data.text,
      });
    });
  },
};
</script>

