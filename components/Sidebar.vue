<template>
  <div class="sidebar">
    <h2>ShishGram</h2>
    <ul>
      <li>Chats</li>
      <li>Contacts</li>
      <li>Settings</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #0e1e2a;
  color: white;
  padding: 15px;
  height: 100vh;
}
.sidebar h2 {
  margin: 0;
  font-size: 24px;
}
.sidebar ul {
  list-style-type: none;
  padding: 0;
}
.sidebar li {
  margin: 15px 0;
  cursor: pointer;
}
.sidebar li:hover {
  text-decoration: underline;
}
</style>