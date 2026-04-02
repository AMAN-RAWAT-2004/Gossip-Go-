const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 30,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
    },

    avatar: {
        type: String,
        default:"https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?semt=ais_incoming&w=740&q=80" ,
    },

    isOnline: {
        type: Boolean,
        default: false,
    },

    lastSeen: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});


module.exports = mongoose.model("User", userSchema);