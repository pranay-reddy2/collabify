import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/api";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-white"
      title="Logout"
    >
      <FiLogOut className="w-4 h-4" />
      <span className="text-sm">Logout</span>
    </button>
  );
};

export default LogoutButton;
