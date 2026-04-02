const express = require("express");
const Message = require("../Models/messageModel");
const Conversation = require("../Models/conversationModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. FOR SENDING MESSAGE
router.post("/", protect, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const senderId = req.user._id; // ✅ secure

    const newMessage = new Message({
      conversationId,
      senderId,
      text,
    });

    const savedMessage = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageSender: senderId,
    });

    res.status(200).json(savedMessage);

  } catch (error) {
    console.error("Send Message Error:", error.message);

    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// 2. GET MESSAGE OF A CONVERSTAION
router.get("/:conversationId",protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  3. DELETE MESSAGE
router.delete("/:messageId",protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json("Message deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});


//  4. MARK AS SEEN 
router.put("/seen/:conversationId",protect, async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        senderId: { $ne: req.body.userId }, 
        isSeen: false,
      },
      { $set: { isSeen: true } }
    );

    res.status(200).json("Messages marked as seen");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;