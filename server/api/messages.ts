import { defineEventHandler, getQuery } from "h3";
import { Message } from "~/server/models/messages.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const chatName = query.chat;

  if (!chatName) {
    return { error: "Chat name is required" };
  }

  try {
    const messages = await Message.find({
      $or: [{ sender: chatName }, { receiver: chatName }],
    }).sort({ timestamp: 1 });
    return messages;
  } catch (error) {
    return { error: "Failed to load messages" };
  }
});
