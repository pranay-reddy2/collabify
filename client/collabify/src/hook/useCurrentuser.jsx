import { useEffect } from "react";
import { getCurrentUser } from "../api/api.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userslice.js";

function useCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchuser = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, skipping user fetch");
          return;
        }

        const result = await getCurrentUser();
        console.log("Current user:", result);

        // ✅ FIX: Store only the user object, not the entire response
        dispatch(setUserData(result));
      } catch (error) {
        console.error("Error fetching user:", error);
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    fetchuser();
  }, [dispatch]);
}

export default useCurrentUser;
