// src/components/Navbar.jsx
import React from "react";
import { FiPlus, FiFolder, FiUsers } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-950/70 backdrop-blur-2xl border border-gray-800 rounded-full px-6 py-3 flex gap-6 shadow-lg z-10">
      {/* Create New Board */}
      <button
        onClick={() => navigate("/create")}
        title="Create New Board"
        className={`p-3 rounded-full transition shadow-lg flex items-center justify-center ${
          isActive("/create")
            ? "bg-indigo-600 text-white scale-110"
            : "bg-indigo-600 hover:bg-indigo-500 text-white"
        }`}
      >
        <FiPlus className="w-6 h-6" />
      </button>

      {/* My Boards (Owner) */}
      <button
        onClick={() => {
          navigate("/dashboard");
          // Trigger tab change if already on dashboard
          window.dispatchEvent(
            new CustomEvent("changeTab", { detail: "my-boards" })
          );
        }}
        title="My Boards"
        className={`p-3 rounded-full transition shadow-lg flex items-center justify-center ${
          isActive("/dashboard")
            ? "bg-purple-600 text-white scale-110"
            : "bg-purple-600 hover:bg-purple-500 text-white"
        }`}
      >
        <FiFolder className="w-6 h-6" />
      </button>

      {/* Shared with Me (Collaborator) */}
      <button
        onClick={() => {
          navigate("/dashboard");
          // Trigger tab change to shared boards
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("changeTab", { detail: "shared" })
            );
          }, 100);
        }}
        title="Shared with Me"
        className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition shadow-lg flex items-center justify-center text-white"
      >
        <FiUsers className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default Navbar;
