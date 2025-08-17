import { Schema, model } from "mongoose";

const messageSchema = Schema({
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = model("message", messageSchema, 'gcBackend');
export default Message;