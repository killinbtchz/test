
import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);
