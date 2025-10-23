// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUserBoards } from "../redux/boardSlice";
import Navbar from "../components/Navbar";
import {
  FiLoader,
  FiFileText,
  FiUsers,
  FiLayers,
  FiStar,
} from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userBoards, status, error } = useSelector((state) => state.board);
  const { userData } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("my-boards"); // "my-boards" or "shared"

  useEffect(() => {
    dispatch(fetchUserBoards());
  }, [dispatch]);

  const handleBoardClick = (boardId) => {
    navigate(`/boardpage/${boardId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter boards based on ownership
  const myBoards = userBoards.filter(
    (board) =>
      board.owner?._id === userData?._id || board.owner === userData?._id
  );

  const sharedBoards = userBoards.filter((board) => {
    const ownerId = board.owner?._id || board.owner;
    const userId = userData?._id;
    return ownerId !== userId;
  });

  const displayedBoards = activeTab === "my-boards" ? myBoards : sharedBoards;

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black opacity-70" />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl opacity-15 mix-blend-screen"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl opacity-15 mix-blend-screen"
        />
        {Array.from({ length: 25 }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-6 md:px-12 py-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {activeTab === "my-boards" ? "My Boards" : "Shared with Me"}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {status === "succeeded" && (
                <span className="flex items-center gap-2">
                  <FiLayers className="w-4 h-4" />
                  {displayedBoards.length}{" "}
                  {displayedBoards.length === 1 ? "board" : "boards"}
                </span>
              )}
            </p>
          </div>

          {/* User Info */}
          {userData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-5 py-2 bg-gray-900/50 border border-gray-800/70 rounded-xl backdrop-blur-md shadow-lg"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold uppercase">
                {userData.name ? userData.name.charAt(0) : "U"}
              </div>
              <span className="text-sm font-semibold text-gray-200">
                {userData.name || "User"}
              </span>
            </motion.div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab("my-boards")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === "my-boards"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-800"
            }`}
          >
            <FiFileText className="w-4 h-4" />
            My Boards
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
              {myBoards.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === "shared"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-gray-900/50 text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-800"
            }`}
          >
            <FiUsers className="w-4 h-4" />
            Shared with Me
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
              {sharedBoards.length}
            </span>
          </button>
        </div>
      </motion.header>

      {/* Loading */}
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FiLoader className="w-12 h-12 text-indigo-500" />
            </motion.div>
            <p className="mt-4 text-gray-400 animate-pulse">
              Loading your boards...
            </p>
          </motion.div>
        )}

        {/* Error */}
        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex items-center justify-center py-20"
          >
            <div className="text-center bg-gray-950/70 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-md">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 mb-6">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(fetchUserBoards())}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg transition-all"
              >
                Retry
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Boards Grid */}
        {status === "succeeded" && (
          <>
            {displayedBoards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative z-10 flex flex-col items-center justify-center py-20 px-6"
              >
                <div className="bg-gray-950/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-12 text-center max-w-md">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    {activeTab === "my-boards" ? (
                      <FiFileText className="w-10 h-10 text-indigo-400" />
                    ) : (
                      <FiUsers className="w-10 h-10 text-purple-400" />
                    )}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {activeTab === "my-boards"
                      ? "No boards yet"
                      : "No shared boards"}
                  </h2>
                  <p className="text-gray-400 text-sm mb-8">
                    {activeTab === "my-boards"
                      ? "Create your first board to start collaborating"
                      : "Boards shared with you will appear here"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 px-6 md:px-12 pb-24 mt-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedBoards.map((board, index) => {
                    const isOwner =
                      board.owner?._id === userData?._id ||
                      board.owner === userData?._id;

                    return (
                      <motion.div
                        key={board._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        onClick={() => handleBoardClick(board._id)}
                        className={`group backdrop-blur-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden ${
                          isOwner
                            ? "bg-gray-950/60 border border-gray-800/50 hover:border-indigo-500/50 hover:shadow-indigo-500/20"
                            : "bg-purple-950/20 border border-purple-800/30 hover:border-purple-500/50 hover:shadow-purple-500/20"
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                                isOwner
                                  ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
                                  : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                              }`}
                            >
                              {isOwner ? (
                                <span className="flex items-center gap-1">
                                  <FiStar className="w-3 h-3" />
                                  Owner
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FiUsers className="w-3 h-3" />
                                  Shared
                                </span>
                              )}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(board.updatedAt || board.createdAt)}
                            </span>
                          </div>

                          <h2 className="text-white font-bold text-xl mb-3 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                            {board.name}
                          </h2>

                          <p className="text-gray-400 text-sm line-clamp-2 mb-4 min-h-[40px]">
                            {board.description || "No description provided"}
                          </p>

                          {!isOwner && board.owner && (
                            <div className="mb-3 flex items-center gap-2 text-xs text-purple-400">
                              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs">
                                {board.owner.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>by {board.owner.name}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-800/50">
                            <div className="flex items-center gap-1.5">
                              <FiLayers className="w-3.5 h-3.5" />
                              <span>{board.data?.blocks?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiUsers className="w-3.5 h-3.5" />
                              <span>{board.collaborators?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.main>
            )}
          </>
        )}
      </AnimatePresence>

      <Navbar />
    </div>
  );
};

export default Dashboard;
