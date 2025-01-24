const express=require('express')
const router=express.Router()
const ChatConvo=require('../models/ChatConvo')

router.post("/", async (req, res) => {
    const { senderId, receiverId, text } = req.body;
  
    try {
      // Find the conversation between sender and receiver
      const chat = await ChatConvo.findOne({
        members: { $all: [senderId, receiverId] },
      });
  
      if (!chat) {
        // If no chat exists, create a new one
        const newChat = new ChatConvo({
          members: [senderId, receiverId],
          messages: [{
            sender: senderId,
            text: text,
          }],
        });
        await newChat.save();
        return res.status(201).json(newChat);
      }
  
      // If chat exists, push the new message to the messages array
      chat.messages.push({
        sender: senderId,
        text: text,
      });
  
      await chat.save();
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  

  router.get("/:firebaseId", async (req, res) => {
    const { firebaseId } = req.params;
    try {
      // Query the ChatConvo collection for conversations where the user's firebaseId is a member
      const conversations = await ChatConvo.find({
        members: firebaseId,
      })
        .populate("members", "fullName avatar") // Populate members with fullName and avatar
        .populate("messages.sender", "fullName avatar"); // Populate sender with fullName and avatar
  
      // Map conversations to show the last message and sender details
      const conversationsWithLastMessage = conversations.map((convo) => {
        const lastMessage = convo.messages[convo.messages.length - 1];
        return {
          ...convo.toObject(),
          lastMessage: lastMessage ? lastMessage.text : "No messages yet",
          sender: lastMessage ? lastMessage.sender : null,
        };
      });
  
      res.json(conversationsWithLastMessage);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });
  
  router.get("/:userId/:otherUserId", async (req, res) => {
    try {
      const { userId, otherUserId } = req.params;
      const chat = await ChatConvo.findOne({
        members: { $all: [userId, otherUserId] }
      });
      res.json(chat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post("/:currentUserId/:userId", async (req, res) => {
    const { currentUserId, userId } = req.params;

    try {
        // Check if a conversation already exists
        let conversation = await ChatConvo.findOne({
            members: { $all: [currentUserId, userId] },
        });

        if (!conversation) {
            // Create a new conversation
            conversation = new ChatConvo({
                members: [currentUserId, userId],
                messages: [], // Start with no messages
            });
            await conversation.save();
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error in creating/fetching conversation:", error.message);
        res.status(500).json({ message: "Failed to create or fetch conversation." });
    }
});
router.get("/userChats/:currentUserId", async (req, res) => {
    const { currentUserId } = req.params;
  
    try {
      const conversations = await ChatConvo.find({
        members: { $in: [currentUserId] },
      });
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Error fetching user chats:", error.message);
      res.status(500).json({ message: "Failed to fetch user chats." });
    }
  });
  

module.exports= router    