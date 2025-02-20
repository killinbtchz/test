import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  participants: [String], 
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }], 
});

export const Chat = model("Chat", ChatSchema);
