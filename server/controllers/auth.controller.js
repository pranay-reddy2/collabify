import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ token, user: { id: newUser._id, name, email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    }); // Include email
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
