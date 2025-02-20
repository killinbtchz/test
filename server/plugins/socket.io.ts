// socket.io.ts
import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { Message } from "~/server/models/messages.model";
import { Chat } from "~/server/models/chats.model";
import { User } from "~/server/models/users.model"; 
import mongoose from "mongoose";

export default defineNitroPlugin(async (nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  try {
    await mongoose.connect("mongodb://localhost:27017/chat");
  } catch (e) {
    console.error(e);
  }

  let clients = new Map<string, string>();

  io.bind(engine);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("logged_in", async (data) => {
      clients.set(data.username, socket.id);
      console.log("logged_in:", data.username, "socket.id:", socket.id);

      let user = await User.findOne({ username: data.username });
      if (!user) {
        user = new User({ username: data.username });
        await user.save();
      }

      const oldMessages = await Message.find({
        $or: [{ sender: data.username }, { receiver: data.username }],
      });
      socket.emit("previousMessages", oldMessages);

      const userChats = await Chat.find({ participants: data.username });
      socket.emit("previousChats", userChats);
    });

    socket.on("create_chat", async (data) => {
      const { participants } = data; 

      let chat = await Chat.findOne({ participants: { $all: participants } });
      if (!chat) {
        chat = new Chat({ participants, messages: [] });
        await chat.save();
      }

      socket.emit("chat_created", chat);
      participants.forEach((user) => {
        if (clients.has(user)) {
          io.to(clients.get(user)!).emit("chat_created", chat);
        }
      });
    });

    socket.on("chat message", async (data) => {
      const message = new Message({
        text: data.text,
        receiver: data.receiver,
        sender: data.sender,
      });
      await message.save();

      let chat = await Chat.findOne({
        participants: { $all: [data.sender, data.receiver] },
      });
      if (!chat) {
        chat = new Chat({
          participants: [data.sender, data.receiver],
          messages: [message._id],
        });
      } else {
        chat.messages.push(message._id);
      }
      await chat.save();

      const receiverSocketId = clients.get(data.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("chat message", {
          text: data.text,
          receiver: data.receiver,
          sender: data.sender,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [username, sId] of clients.entries()) {
        if (sId === socket.id) {
          clients.delete(username);
          break;
        }
      }
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          engine.prepare(peer._internal.nodeReq);
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );
});
