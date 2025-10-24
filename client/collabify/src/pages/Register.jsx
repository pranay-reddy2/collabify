import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../api/api.js";
import { setUserData } from "../redux/userslice.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await register({ name, email, password });
      console.log("✅ Registration successful:", response);

      // ✅ Ensure we have user data
      if (!response.user) {
        throw new Error("No user data received from server");
      }

      // ✅ Save user data in Redux
      dispatch(setUserData(response.user));

      // ✅ Save user data and token in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(response.user));
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      console.log("✅ User stored:", response.user);
      console.log("✅ Token stored:", !!localStorage.getItem("token"));

      // ✅ Clear form
      setName("");
      setEmail("");
      setPassword("");

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Registration failed:", error);
      setError(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const particles = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black text-gray-100">
      {/* Floating neon particles */}
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-sm p-8 bg-gray-950/70 border border-purple-600/50 rounded-2xl backdrop-blur-2xl shadow-[0_0_40px_rgba(128,0,255,0.3)]">
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="Collabify Logo"
            className="mx-auto h-24 w-auto opacity-100 drop-shadow-lg"
          />
          <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-1 text-sm text-purple-300">
            Join <span className="text-white font-semibold">Collabify</span> and
            start collaborating
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSignUp} noValidate>
          {error && (
            <div className="p-2 bg-red-800/70 border border-red-700 text-red-200 text-sm rounded">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-900 border border-purple-600 text-white placeholder-purple-400 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-purple-400 hover:text-purple-200 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-600 shadow-[0_0_15px_rgba(128,0,255,0.7)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-purple-300">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-400 hover:text-purple-300 transition"
          >
            Sign in
          </a>
        </p>
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

export default Register;
