<script>
import { io } from "socket.io-client";

if(process.client){
    let socket = io('ws://localhost:3000');
    socket.on("hello", (data) => {
        console.log(data)
    })
}

</script>
<template>
    <h1>тут будут сокеты</h1>
</template>