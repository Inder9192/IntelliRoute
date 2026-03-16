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

router.put("/:id", authMiddleware, async (req, res) => {
  const backend = await BackendService.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    req.body,
    { new: true }
  );

  if (!backend) return res.status(404).json({ message: "Backend not found" });

  res.json(backend);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const backend = await BackendService.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.user.tenantId
  });

  if (!backend) return res.status(404).json({ message: "Backend not found" });

  res.json({ message: "Deleted" });
});

module.exports = router;
