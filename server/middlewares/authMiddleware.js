import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  // Try to get token from cookie first (for local dev)
  let token = req.cookies.token;

  // If no cookie, try Authorization header (for production)
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

export default auth;
