const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatConvoId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String },
    isSent:{
      type:Boolean
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
