import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.userId;
  console.log(req.userId);

  try {
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
