import React from "react";
import { FiPlus, FiFolder, FiUsers, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-950/70 backdrop-blur-2xl border border-gray-800 rounded-full px-6 py-3 flex gap-6 shadow-lg z-10">
      {/* Create File/Page */}
      <button
        onClick={() => navigate("/create")}
        title="Create New"
        className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition shadow-lg flex items-center justify-center"
      >
        <FiPlus className="w-6 h-6 text-white" />
      </button>

      {/* My Files */}
      <button
        onClick={() => navigate("/my-files")}
        title="My Files"
        className="p-3 bg-purple-600 hover:bg-purple-500 rounded-full transition shadow-lg flex items-center justify-center"
      >
        <FiFolder className="w-6 h-6 text-white" />
      </button>

      {/* Collaborations */}
      <button
        onClick={() => navigate("/shared")}
        title="Shared with Me"
        className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition shadow-lg flex items-center justify-center"
      >
        <FiUsers className="w-6 h-6 text-white" />
      </button>
    </nav>
  );
};

export default Navbar;
