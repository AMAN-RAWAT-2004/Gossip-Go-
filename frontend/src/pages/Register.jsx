import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../Redux/Slices/authSlices";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Redirect after register
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password) return;

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-green-900 text-4xl font-bold mb-6">
        Register
      </h1>

      <div className="w-[400px] h-[480px] rounded-2xl bg-green-900/60 shadow-lg">
        
        <form
          onSubmit={handleRegister}
          className="flex flex-col w-full h-full justify-center items-center gap-4 px-6"
        >

          {/* 🔴 Error */}
          {error && (
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Name */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-white mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name..."
              value={name}
              className="rounded p-2 text-sm bg-white border border-green-900 outline-none"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              className="rounded p-2 text-sm bg-white border border-green-900 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-white mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password..."
              value={password}
              className="rounded p-2 text-sm bg-white border border-green-900 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg mt-4 w-full transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Redirect */}
          <p className="text-xs text-white mt-4">
            Already have an account?{" "}
            <Link to="/login" className="underline font-semibold">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;