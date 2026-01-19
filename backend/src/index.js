const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const backendRoutes = require("./routes/backendRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const proxyHandler = require("./proxy/proxyServer");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/backends", backendRoutes);
app.use("/api/proxy", authMiddleware, proxyHandler);

app.get("/", (req, res) => {
  res.send("IntelliRoute Backend Running 🚀");
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
