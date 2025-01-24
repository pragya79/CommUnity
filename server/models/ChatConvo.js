const mongoose = require("mongoose");

const ChatConvoSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    messages: [{
      sender: {
        type: String
      },
      text: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatConvo", ChatConvoSchema);