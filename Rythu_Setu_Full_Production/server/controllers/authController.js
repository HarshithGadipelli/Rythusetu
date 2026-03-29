const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { calculateTrustScore } = require("../services/trustScore");

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || "rythu_setu_secret",
    { expiresIn: "7d" }
  );

async function registerUser(req, res) {
  try {
    const { name, email, password, role, phone, address, lat, lng } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hashedPassword,
      role: ["farmer", "customer", "admin"].includes(role) ? role : "customer",
      phone: phone || "",
      location: { address: address || "", lat: lat ? Number(lat) : null, lng: lng ? Number(lng) : null },
      verified: role === "admin"
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trustScore: calculateTrustScore(user)
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = signToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        trustScore: calculateTrustScore(user)
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err.message });
  }
}

async function me(req, res) {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
    trustScore: calculateTrustScore(user),
    location: user.location,
    phone: user.phone
  });
}

module.exports = { registerUser, loginUser, me };
