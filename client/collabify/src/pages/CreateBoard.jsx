import React, { useState, useEffect } from "react";
import { FiUserPlus, FiX, FiLoader } from "react-icons/fi";
import logo from "../assets/logo.png";
import { createBoard } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [collaborator, setCollaborator] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Check if userData is loaded
  useEffect(() => {
    if (!userData) {
      console.log("User data not loaded yet...");
    } else {
      console.log("User data loaded:", userData);
    }
  }, [userData]);

  const handleAddCollaborator = () => {
    if (collaborator && !collaborators.includes(collaborator)) {
      setCollaborators([...collaborators, collaborator]);
      setCollaborator("");
    }
  };

  const handleRemoveCollaborator = (name) => {
    setCollaborators(collaborators.filter((c) => c !== name));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // ✅ FIX: Check userData directly (not userData.user)
    if (!userData || !userData._id) {
      setError("User data not loaded. Please refresh the page and try again.");
      console.error("User data is missing:", userData);
      return;
    }

    if (!boardName) {
      setError("Board name is required!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const boardData = {
        name: boardName,
        owner: userData._id, // ✅ Now this will work correctly
        collaborators,
        description,
        data: {
          blocks: [],
          drawing: [],
        },
      };

      console.log("Creating board with data:", boardData);

      const res = await createBoard(boardData);
      console.log("Board created response:", res);

      const newBoardId = res._id || res.data?._id || res.id;
      console.log("Extracted board ID:", newBoardId);

      if (!newBoardId) {
        console.error("No board ID found in response:", res);
        throw new Error("Board created but no ID returned from server");
      }

      const navigationPath = `/boardpage/${newBoardId}`;
      console.log("Navigating to:", navigationPath);
      navigate(navigationPath);
    } catch (err) {
      console.error("Error creating board:", err);
      setError(
        err.response?.data?.msg || err.message || "Failed to create board"
      );
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 25 }, (_, i) => i);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-gray-100">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-500/50 shadow-xl animate-neonOrb"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 8}s`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-lg p-8 border border-purple-700/60 rounded-xl shadow-[0_0_30px_rgba(128,0,255,0.5)] bg-gray-950/80 backdrop-blur-2xl">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="mx-auto h-20 drop-shadow-lg" />
          <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">
            Create New Board
          </h2>
          <p className="mt-1 text-sm text-purple-300">
            Set up your workspace and invite collaborators
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-800/70 border border-red-700 text-red-200 text-sm rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Board Name
            </label>
            <input
              type="text"
              placeholder="Enter board name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Collaborators
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter email or username"
                value={collaborator}
                onChange={(e) => setCollaborator(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="button"
                onClick={handleAddCollaborator}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded transition shadow-md flex items-center gap-2"
              >
                <FiUserPlus className="w-5 h-5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap mt-3 gap-2">
              {collaborators.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-purple-800/30 border border-purple-700 px-3 py-1 rounded-full text-sm text-purple-200"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => handleRemoveCollaborator(c)}
                    className="hover:text-red-400 transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe your board..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-600 shadow-[0_0_15px_rgba(128,0,255,0.7)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Board"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes neonOrb {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-25px) translateX(15px); opacity: 0.8; }
        }
        .animate-neonOrb { animation: neonOrb linear infinite; }
      `}</style>
    </div>
  );
};

export default CreateBoard;
