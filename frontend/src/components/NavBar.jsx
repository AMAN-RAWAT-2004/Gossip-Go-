import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/authSlices";
import { useNavigate } from "react-router-dom";
import Logo from "./../assets/GossipGo.png";
import { GiHamburgerMenu } from "react-icons/gi";

const NavBar = ({toggleSidebar}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

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
    <div className="flex fixed top-0 left-0 w-full  justify-between items-center px-3 py-6 md:px-6 md:py-2 bg-[#084F3D] shadow-md z-50">
      
      {/* LEFT - Logo + Name */}
      <div className="flex gap-2 items-center">
        <img className="w-10 h-10 md:w-10 md:h-10  md:mr-2" src={Logo} alt="logo" />
        <h1 className="text-xl md:text-2xl font-bold text-white">
          GoosipGo
        </h1>
      </div>

      {/* RIGHT - User + Logout */}
      <div className="hidden md:flex items-center gap-4">
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
      <GiHamburgerMenu onClick={toggleSidebar} className="text-xl md:hidden text-white mr-3 "  />

    </div>
  );
};

export default NavBar;