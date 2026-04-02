import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./Redux/store";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/NavBar";


// 🔐 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user ? children : <Navigate to="/login" />;
};


// 📦 Layout with Navbar
const Layout = ({ children  }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <NavBar toggleSidebar={() => setIsSidebarOpen(prev => !prev)}  />
      <div className="pt-20">
        {React.cloneElement(children, {
          isSidebarOpen,
          setIsSidebarOpen,
        })}
      </div>
    </>
  );
};


function AppRoutes() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>

      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/chat" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/chat" />}
      />

      {/* Protected Routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatPage  />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to={user ? "/chat" : "/login"} />}
      />

    </Routes>
  );
}


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;