const express=require('express')
const router=express.Router()
const Conversation=require('../Models/conversationModel');
const { protect } = require('../middleware/authMiddleware');


router.post("/", protect, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    let convo = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = new Conversation({
        members: [senderId, receiverId],
      });

      await convo.save();
    }

    res.status(200).json(convo);

  } catch (error) {
    console.error("Conversation Error:", error.message);

    res.status(500).json({
      msg: "Server Error",
    });
  }
});

router.get("/:userId", protect,async (req, res) => {
  try {
    const convos = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ updatedAt: -1 });

    res.status(200).json(convos);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports=router;