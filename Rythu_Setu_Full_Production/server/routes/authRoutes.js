const express = require("express");
const router = express.Router();

const { registerUser, loginUser, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.get("/", (req, res) => res.send("Auth API Working"));
router.get("/register", (req, res) => res.send("Register endpoint ready. Use POST"));
router.get("/login", (req, res) => res.send("Login endpoint ready. Use POST"));

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, me);

module.exports = router;
