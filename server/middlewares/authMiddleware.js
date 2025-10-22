import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Set both req.userId AND req.user for consistency
    req.userId = decoded.id;
    req.user = decoded.id; // Add this line

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

export default auth;
