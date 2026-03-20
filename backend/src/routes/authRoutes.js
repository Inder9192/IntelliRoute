const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Tenant = require("../models/Tenant");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { name, email, password, companyName } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const apiKey = "ir_" + crypto.randomBytes(24).toString("hex");

  const tenant = await Tenant.create({ name: companyName, apiKey });

  await User.create({
    name,
    email,
    password: hashedPassword,
    tenantId: tenant._id
  });

  res.status(201).json({ msg: "Registered successfully" });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, tenantId: user.tenantId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const tenant = await Tenant.findById(user.tenantId);

  res.json({ token, apiKey: tenant?.apiKey || null });
});

router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ msg: "Both fields are required" });

  if (newPassword.length < 6)
    return res.status(400).json({ msg: "New password must be at least 6 characters" });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ msg: "Password changed successfully" });
});

module.exports = router;
