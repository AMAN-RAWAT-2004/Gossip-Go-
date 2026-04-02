import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  addMessage,
} from "../Redux/Slices/messageSlice";
import socket from "./../socket";

const ChatWindow = ({ currentUser, isOpen }) => {
  const dispatch = useDispatch();

  const { activeConversation } = useSelector((state) => state.conversation);
  const { users } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const lastMessageRef = useRef();
  const typingTimeoutRef = useRef(null);

  //  connect user
  useEffect(() => {
    if (currentUser?.userId) {
      socket.emit("addUser", currentUser.userId);
    }
  }, [currentUser]);

  //  fetch messages
  useEffect(() => {
    if (activeConversation) {
      dispatch(fetchMessages(activeConversation._id));
    }
  }, [activeConversation, dispatch]);

  //  listen messages
  useEffect(() => {
    const handler = (data) => {
      if (data.conversationId === activeConversation?._id) {
        dispatch(addMessage(data));
      }
    };

    socket.on("getMessage", handler);

    return () => {
      socket.off("getMessage", handler);
    };
  }, [dispatch, activeConversation]);

  //  auto scroll (messages + typing)
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  //  find other user
  const otherUser = users.find(
    (u) =>
      activeConversation?.members.includes(u._id) &&
      u._id !== currentUser.userId
  );

  //  SEND MESSAGE
  const handleSend = () => {
    if (!newMessage.trim() || !activeConversation || !otherUser) return;

    socket.emit("sendMessage", {
      senderId: currentUser.userId,
      receiverId: otherUser._id,
      text: newMessage,
      conversationId: activeConversation._id,
    });

    // stop typing
    socket.emit("stopTyping", {
      senderId: currentUser.userId,
      receiverId: otherUser._id,
    });

    setNewMessage("");
  };

  //  TYPING HANDLER
  const handleTyping = () => {
    if (!otherUser) return;

    socket.emit("typing", {
      senderId: currentUser.userId,
      receiverId: otherUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        senderId: currentUser.userId,
        receiverId: otherUser._id,
      });
    }, 1000);
  };

  //  listen typing
  useEffect(() => {
    const typingHandler = ({ senderId }) => {
      if (senderId === otherUser?._id) {
        setIsTyping(true);
      }
    };

    const stopTypingHandler = ({ senderId }) => {
      if (senderId === otherUser?._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
    };
  }, [otherUser]);

  //  no chat
  if (!activeConversation) {
    return (
     <div
  className={`flex items-center justify-center overflow-y-hidden h-full w-full bg-[#333333] text-2xl text-white transition-transform duration-300 ${
    isOpen ? "translate-x-full md:translate-x-0" : "translate-x-0"
  }`}
>
        Select a chat
      </div>
    );
  }

  return (
  <div
  className={`flex flex-col h-full w-full bg-[#333333] text-white overflow-y-hidden transition-transform duration-300 ${
    isOpen ? "translate-x-full md:translate-x-0" : "translate-x-0"
  }`}
>

    {/*  HEADER (STAYS AT TOP) */}
    <div className="h-20 bg-black p-2 flex items-center gap-2">
      <img
        src={
          otherUser?.avatar ||
          "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg"
        }
        alt={otherUser?.name}
        className="w-14 h-14 rounded-full object-cover"
      />

      <div>
        <h1 className="text-sm">{otherUser?.name}</h1>
        <h1 className="text-xs">
          {isTyping ? "Typing..." : otherUser?.email}
        </h1>
      </div>
    </div>

    {/*  MESSAGES (SCROLLABLE AREA) */}
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">

      {messages.map((msg, index) => {
        const isSender = msg.senderId === currentUser.userId;
        const isLast = index === messages.length - 1;

        return (
          <div
            key={msg._id}
            ref={isLast ? lastMessageRef : null}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                isSender
                  ? "bg-green-400/20 text-white rounded-br-none"
                  : "bg-gray-400/20 text-white rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>

              <span className="text-[10px] opacity-70 block text-right">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}

      {/*  Typing indicator */}
      {isTyping && (
        <div ref={lastMessageRef} className="flex justify-start">
          <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-400/20  rounded-bl-none">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        </div>
      )}

    </div>

    {/*  INPUT (STAYS AT BOTTOM AUTOMATICALLY) */}
    <div className="p-3 flex gap-2 bg-black">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          handleTyping();
        }}
        className="flex-1 h-12 border border-gray-500 bg-gray-800 rounded-full px-5 text-white outline-none"
        placeholder="Type a message"
      />

      <button
        onClick={handleSend}
        className="bg-green-400/20 hover:bg-green-400/30 p-3 rounded-full"
      >
        <IoSend className="text-xl text-white" />
      </button>
    </div>

  </div>
);}

export default ChatWindow;