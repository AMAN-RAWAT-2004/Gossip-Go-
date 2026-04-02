import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Redux/Slices/userSlices";
import { createOrGetConversation } from "../Redux/Slices/conversationSlices";
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/authSlices";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const {  user } = useSelector((state) => state.auth);
    const navigate=useNavigate()
  const { loading, error, users } = useSelector((state) => state.users);
  const { activeConversation } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleClick = async (user) => {
    try {
      await dispatch(
        createOrGetConversation({ receiverId: user._id })
      ).unwrap();
      setIsSidebarOpen(false);
    } catch (err) {
      console.log("Error creating conversation", err);
    }
  };

   useEffect(()=>{
  
      if(!user){
        navigate("/login")
      }
    },[user,navigate])
  
    const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
    };

  return (
    <div className= {`overflow-y-scroll  h-full transition-transform ${
  isOpen ? "translate-x-0" : "-translate-x-full"
} bg-white md:bg-transparent md:translate-x-0 `}>

      {/* HEADER */}
      <div className="h-20 fixed flex flex-row justify-between items-center top-0 bg-black w-full z-50 p-4">
        <h1 className="text-2xl  font-bold text-white ">
          Chats
        </h1>

        <div className="md:hidden flex items-center gap-4">
        <span className="font-semibold text-white">
          {user?.username || "User"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 md:px-4 md:py-1 rounded-md transition"
        >
          Logout
        </button>
      </div>
      </div>

      {/* USERS */}
      <div className="flex flex-col mt-20">

        {loading && (
          <p className="text-white text-2xl text-center mt-6">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-red-400 text-center mt-6">
            {error}
          </p>
        )}

        {users.map((user) => {
          const isActive =
            activeConversation?.members?.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => handleClick(user)}
              className={`w-full flex items-center md:text-white px-3 py-2 border md:border-0 cursor-pointer hover:bg-gray-700 ${
                isActive ? "bg-gray-700" : ""
              }`}
            >
              {/* Avatar */}
              <img
  src={user.avatar || "https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg?semt=ais_incoming&w=740&q=80"}
  alt={user.name}
  
  className="w-14 h-14 rounded-full border border-black object-cover"
/>

              {/* Info */}
              <div className="p-2">
                <h1 className="text-sm">{user.name}</h1>
                <p className="text-xs text-gray-400 truncate">
  {activeConversation?.members?.includes(user._id)
    ? activeConversation?.lastMessage || "Start chatting..."
    : "Start chatting..."}
</p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Sidebar;