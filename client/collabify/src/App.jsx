// src/App.jsx - FIXED VERSION
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateBoard from "./pages/CreateBoard";
import BoardPage from "./pages/BoardPage";
import useCurrentUser from "./hook/useCurrentuser";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "./redux/userslice";
import { FiLoader } from "react-icons/fi";

export default function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useCurrentUser();

  // Initialize user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && !userData) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Restoring user from localStorage:", parsedUser);
        dispatch(setUserData(parsedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, [dispatch, userData]);

  // Check if token exists in localStorage
  const hasToken = !!localStorage.getItem("token");
  const isAuthenticated = userData || hasToken;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/create"
        element={isAuthenticated ? <CreateBoard /> : <Navigate to="/login" />}
      />
      <Route
        path="/boardpage/:id"
        element={isAuthenticated ? <BoardPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
