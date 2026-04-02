const {
    Server
} = require("socket.io");
const Message = require("./Models/messageModel");
const Conversation = require("./Models/conversationModel");

let users = [];

const addUser = (userId, socketId) => {
    if (!users.some((u) => u.userId === userId)) {
        users.push({
            userId,
            socketId
        });
    }
};

const getUser = (userId) => {
    return users.find((u) => u.userId === userId);
};

const socketSetup = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*"
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        // ✅ Add user
        socket.on("addUser", (userId) => {
            console.log("User added:", userId);
            addUser(userId, socket.id);
        });

        // 🔥 SEND MESSAGE
        socket.on("sendMessage", async (data) => {
            try {
                const {
                    senderId,
                    receiverId,
                    text,
                    conversationId
                } = data;

                // console.log("📨 Incoming message:", data);

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

                const receiver = getUser(receiverId);

                // ✅ Send to receiver
                if (receiver) {
                    io.to(receiver.socketId).emit("getMessage", savedMessage);
                }

                // ✅ ALSO send back to sender (important)
                socket.emit("getMessage", savedMessage);

            } catch (error) {
                console.log("❌ Socket Error:", error.message);
            }
        });
        // Typing indicator on 
        socket.on("typing", ({
            senderId,
            receiverId
        }) => {
            const receiver = getUser(receiverId)
            if (receiver) {
                io.to(receiver.socketId).emit("typing", {
                    senderId
                })
            }
        })
        // Typing indicator off

        socket.on("stopTyping", ({
            senderId,
            receiverId
        }) => {
            const receiver = getUser(receiverId);
            if (receiver) {
                io.to(receiver.socketId).emit("stopTyping", {
                    senderId
                });
            }
        });

        // 🔴 Disconnect
        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
            users = users.filter((u) => u.socketId !== socket.id);
        });
    });
};

module.exports = socketSetup;