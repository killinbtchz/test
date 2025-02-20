import { Message } from "~/server/models/messages.model";
import mongoose from "mongoose";
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const sender = getQuery(event).sender
  let messages = Message.find({receiver: name, sender: sender}).exec()
  return messages
})