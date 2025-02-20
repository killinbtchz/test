<template>
  <div class="chat-list">
    <h3>Chats</h3>
    <ul>
      <li v-for="chat in chats" :key="chat.id" @click="selectChat(chat)">
        {{ chat.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ChatList",
  props: {
    chats: Array,
  },
  methods: {
    selectChat(chat) {
      this.$emit("chat-selected", chat);
    },
  },
};
</script>

<style scoped>
.chat-list {
  padding: 15px;
  background-color: #f2f2f2;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
.chat-list h3 {
  margin: 0;
  font-size: 18px;
}
.chat-list ul {
  list-style-type: none;
  padding: 0;
}
.chat-list li {
  padding: 10px;
  cursor: pointer;
}
.chat-list li:hover {
  background-color: #e0e0e0;
}
</style>