const Tenant = require("../models/Tenant");

module.exports = async (req, res, next) => {
  const apiKey = req.header("X-IntelliRoute-Key");
  if (!apiKey) return res.status(401).json({ msg: "Missing X-IntelliRoute-Key header" });

  const tenant = await Tenant.findOne({ apiKey }).catch(() => null);
  if (!tenant) return res.status(401).json({ msg: "Invalid API key" });

  req.user = { tenantId: tenant._id.toString() };
  next();
};
