// src/components/CollaboratorManager.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUserPlus, FiX, FiTrash2, FiUsers, FiMail } from "react-icons/fi";
import { addCollaborator, removeCollaborator } from "../api/api";

const CollaboratorManager = ({ board, onUpdate, currentUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner =
    board?.owner?._id === currentUserId || board?.owner === currentUserId;

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollaborator.trim()) return;

    setLoading(true);
    setError("");

    try {
      const updatedBoard = await addCollaborator(board._id, newCollaborator);
      onUpdate(updatedBoard);
      setNewCollaborator("");
      alert(`Collaborator ${newCollaborator} added successfully!`);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm("Remove this collaborator?")) return;

    setLoading(true);
    setError("");

    try {
      const updatedBoard = await removeCollaborator(board._id, collaboratorId);
      onUpdate(updatedBoard);
      alert("Collaborator removed successfully!");
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 rounded-lg transition-colors"
        title="Manage Collaborators"
      >
        <FiUsers className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">
          {board?.collaborators?.length || 0}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-950/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-indigo-400" />
                  Collaborators
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Owner */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                  Owner
                </p>
                <div className="flex items-center gap-3 p-3 bg-indigo-900/20 border border-indigo-700/30 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                    {board?.owner?.name?.charAt(0).toUpperCase() || "O"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {board?.owner?.name || "Owner"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {board?.owner?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add Collaborator (only for owner) */}
              {isOwner && (
                <form onSubmit={handleAddCollaborator} className="mb-6">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Add Collaborator
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCollaborator}
                      onChange={(e) => setNewCollaborator(e.target.value)}
                      placeholder="Enter email or username"
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !newCollaborator.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <FiUserPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </form>
              )}

              {/* Collaborators List */}
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                  Collaborators ({board?.collaborators?.length || 0})
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {board?.collaborators?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No collaborators yet
                    </div>
                  ) : (
                    board?.collaborators?.map((collaborator) => (
                      <div
                        key={collaborator._id}
                        className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors group"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm">
                          {collaborator.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {collaborator.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {collaborator.email}
                          </p>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() =>
                              handleRemoveCollaborator(collaborator._id)
                            }
                            disabled={loading}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {!isOwner && (
                <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-lg text-xs text-gray-400">
                  <FiMail className="w-4 h-4 inline mr-2" />
                  Only the owner can add or remove collaborators
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollaboratorManager;
