import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Redux/Slices/authSlices";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Redirect after login
  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">
      
      <h1 className="text-green-900 text-4xl font-bold mb-6">
        Login
      </h1>

      <div className="w-[400px] h-[420px] rounded-2xl bg-green-900/60 shadow-lg">
        
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-full h-full justify-center items-center gap-4 px-6"
        >

          {/* 🔴 Error */}
          {error && (
            <p className="bg-red-600 text-white  text-sm text-center font-medium">
              *{error?.msg || error}
            </p>
          )}

          {/* Email */}
          <div className="flex flex-col w-full">
            <label className="text-xs text-white mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email..."
              value={email}
              className="rounded p-2 text-sm bg-white border border-green-900 outline-none"
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg mt-4 w-full transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register link */}
          <p className="text-xs text-white mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="underline font-semibold">
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;