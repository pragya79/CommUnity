const express=require('express')
const router=express.Router()
const Message=require('../models/Message')

router.post("/", async (req, res) => {
    try {
      const { chatConvoId, sender, text, image } = req.body; // Include image
      const newMessage = new Message({
        chatConvoId,
        sender,
        text,
        image, 
      });
  
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Get all messages in a conversation
  router.get("/:chatConvoId", async (req, res) => {
    try {
      const messages = await Message.find({ chatConvoId: req.params.chatConvoId });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports= router