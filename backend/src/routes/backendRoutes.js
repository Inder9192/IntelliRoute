const express = require("express");
const BackendService = require("../models/backendService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, async (req, res) => {
  const { name, url } = req.body;

  const backend = await BackendService.create({
    tenantId: req.user.tenantId,
    name,
    url
  });

  res.json(backend);
});

router.get("/list", authMiddleware, async (req, res) => {
  const backends = await BackendService.find({
    tenantId: req.user.tenantId
  });

  res.json(backends);
});

module.exports = router;
