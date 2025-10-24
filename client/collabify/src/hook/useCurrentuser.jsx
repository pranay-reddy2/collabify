// src/hook/useCurrentuser.jsx - FIXED VERSION
import { useEffect } from "react";
import { getCurrentUser } from "../api/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userslice.js";

function useCurrentUser() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Skip if userData already loaded
        if (userData) {
          console.log("User data already loaded:", userData);
          return;
        }

        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, skipping user fetch");
          return;
        }

        console.log("Fetching current user...");
        const result = await getCurrentUser();
        console.log("Current user fetched:", result);

        // Store user data in Redux
        dispatch(setUserData(result));

        // Also update localStorage for persistence
        localStorage.setItem("user", JSON.stringify(result));
      } catch (error) {
        console.error("Error fetching user:", error);
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Clear Redux state
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, [dispatch, userData]); // Add userData to dependencies

  return userData;
}

export default useCurrentUser;
