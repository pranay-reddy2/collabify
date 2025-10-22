import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserBoards } from "../redux/boardSlice";
import Navbar from "../components/Navbar";
import { FiLoader, FiFileText } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userBoards, status, error } = useSelector((state) => state.board);

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

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 relative overflow-hidden px-6 py-12">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      {/* Neon Blobs */}
      <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl opacity-20 mix-blend-screen animate-pulse z-0" />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl opacity-15 mix-blend-screen animate-pulse z-0"
        style={{ animationDelay: "3.8s" }}
      />

      {/* Dashboard Header */}
      <header className="relative z-10 flex items-center justify-between p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Boards</h1>
          <p className="text-gray-400 text-sm mt-1">
            {userBoards.length} {userBoards.length === 1 ? "board" : "boards"}{" "}
            total
          </p>
        </div>
      </header>

      {/* Loading State */}
      {status === "loading" && (
        <div className="relative z-10 flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {status === "failed" && (
        <div className="relative z-10 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchUserBoards())}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Boards Grid */}
      {status === "succeeded" && (
        <>
          {userBoards.length === 0 ? (
            <div className="relative z-10 flex flex-col items-center justify-center py-20">
              <FiFileText className="w-16 h-16 text-gray-600 mb-4" />
              <h2 className="text-xl text-gray-400 mb-2">No boards yet</h2>
              <p className="text-gray-500 text-sm mb-6">
                Create your first board to get started
              </p>
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition"
              >
                Create Board
              </button>
            </div>
          ) : (
            <main className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {userBoards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => handleBoardClick(board._id)}
                  className="bg-gray-950/70 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl shadow-indigo-500/20 p-6 hover:scale-105 hover:border-indigo-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-indigo-400 font-semibold text-sm">
                      Board
                    </span>
                    <span className="text-gray-400 text-xs">
                      {formatDate(board.updatedAt || board.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-white font-bold text-xl mb-3 truncate group-hover:text-indigo-400 transition">
                    {board.name}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {board.description || "No description"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <span>{board.data?.blocks?.length || 0} blocks</span>
                    <span>•</span>
                    <span>
                      {board.collaborators?.length || 0} collaborators
                    </span>
                  </div>
                </div>
              ))}
            </main>
          )}
        </>
      )}

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
};

export default Dashboard;
