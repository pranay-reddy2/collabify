import React from "react";
import Navbar from "../components/Navbar";

const files = [
  { id: 1, name: "Project Proposal", type: "Document", updated: "22 Oct 2025" },
  { id: 2, name: "Meeting Notes", type: "Document", updated: "21 Oct 2025" },
  {
    id: 3,
    name: "Presentation Slides",
    type: "Presentation",
    updated: "20 Oct 2025",
  },
  { id: 4, name: "Budget.xlsx", type: "Spreadsheet", updated: "19 Oct 2025" },
  { id: 5, name: "Design Mockup", type: "Image", updated: "18 Oct 2025" },
];

const Dashboard = () => {
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
        <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
      </header>

      {/* Notion-style Cards Grid */}
      <main className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-gray-950/70 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl shadow-indigo-500/20 p-6 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-indigo-400 font-semibold text-sm">
                {file.type}
              </span>
              <span className="text-gray-400 text-xs">{file.updated}</span>
            </div>
            <h2 className="text-white font-bold text-xl mb-3">{file.name}</h2>
            <p className="text-gray-400 text-sm truncate">
              This is a preview of your {file.type.toLowerCase()}.
            </p>
          </div>
        ))}
      </main>

      {/* Bottom Navbar */}
      <Navbar />
    </div>
  );
};

export default Dashboard;
