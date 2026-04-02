const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// 🔐 Generate Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};


// 📝 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔍 Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Successfully Registered",
      data: {
        userId: user._id,
        username: user.name,
        email: user.email,
        token,
        status: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      msg: "Server Error",
    });
  }
};


// 🔑 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password required",
      });
    }

    // 2. Find user (include password)
    const user = await User.findOne({ email }).select("+password");

    // 3. Check user exists
    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    // 🔥 EXTRA SAFETY CHECK
    if (!user.password) {
      console.log("❌ Password missing in DB for user:", user.email);
      return res.status(500).json({
        msg: "Something went wrong",
      });
    }

    // 4. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    // 5. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // 6. Success response
    res.status(200).json({
      message: "Successfully Login",
      data: {
        userId: user._id,
        username: user.name,
        email: user.email,
        token,
        status: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error.message);

    res.status(500).json({
      msg: error.message || "Server Error",
    });
  }
};