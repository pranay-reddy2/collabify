import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateBoard from "./pages/CreateBoard";
import BoardPage from "./pages/BoardPage";
import useCurrentUser from "./hook/useCurrentuser";
import { useSelector } from "react-redux";

export default function App() {
  useCurrentUser();
  const { userData } = useSelector((state) => state.user);

  // Check if token exists in localStorage
  const hasToken = !!localStorage.getItem("token");
  const isAuthenticated = userData || hasToken;

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
