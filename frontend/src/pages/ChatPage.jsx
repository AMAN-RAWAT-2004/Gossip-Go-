import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = ({ isSidebarOpen,setIsSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const { activeConversation } = useSelector(
    (state) => state.conversation
  );

  return (
    <div className="flex h-screen w-full md:p-2">

      {/* Sidebar */}
      <div className="w-full md:w-1/4 h-full md:h-[90%] fixed left-0 bottom:0 md:bottom-5 bg-black/80 border  border-white rounded-md">
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-3/4  md:fixed md:right-0 h-full md:h-[90%] md:bottom-5 bg-black/80 border border-white rounded-md overflow-auto">
        <ChatWindow
          currentUser={user}
          isOpen={isSidebarOpen}
          conversation={activeConversation}
        />
      </div>

    </div>
  );
};

export default ChatPage;