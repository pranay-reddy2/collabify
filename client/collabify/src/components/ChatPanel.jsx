// src/components/ChatPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiMessageSquare, FiUsers } from "react-icons/fi";
import axios from "axios";

const ChatPanel = ({ boardId, socket, isOpen, onClose, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages on mount
  useEffect(() => {
    if (boardId && isOpen) {
      fetchMessages();
    }
  }, [boardId, isOpen]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-typing", ({ userName }) => {
      setTypingUser(userName);
      setIsTyping(true);
    });

    socket.on("user-stop-typing", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/messages/${boardId}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/messages/${boardId}`,
        { content: newMessage },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, response.data]);
      socket?.emit("send-message", { boardId, message: response.data });
      setNewMessage("");

      // Stop typing indicator
      socket?.emit("stop-typing", { boardId });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit("typing", { boardId, userName: currentUser?.name });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", { boardId });
    }, 2000);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed right-0 top-0 h-full w-96 bg-gray-950/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FiMessageSquare className="w-12 h-12 text-gray-700 mb-2" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender?._id === currentUser?._id;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    isCurrentUser
                      ? "bg-indigo-600/90 text-white"
                      : "bg-gray-800/90 text-gray-100"
                  } rounded-2xl px-4 py-2 shadow-lg`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs text-gray-400 mb-1">
                      {msg.senderName || msg.sender?.name}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        {isTyping && typingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
            </div>
            <span>{typingUser} is typing...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-800 bg-gray-900/50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <FiSend className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatPanel;
