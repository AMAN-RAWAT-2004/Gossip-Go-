const express=require('express')
const {protect}=require('./../middleware/authMiddleware')
const User=require('./../Models/userModel')
const router=express.Router()

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }, 
    }).select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

module.exports=router;