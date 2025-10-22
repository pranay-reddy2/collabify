import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import useCurrentUser from "./hook/useCurrentuser";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import CreateBoard from "./pages/CreateBoard";
import BoardPage from "./pages/BoardPage";

export default function App() {
  useCurrentUser();
  const { userData } = useSelector((state) => state.user);
  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateBoard />} />
      <Route path="/boardpage/:id" element={<BoardPage />} />
    </Routes>
  );
}
