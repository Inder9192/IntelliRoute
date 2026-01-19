const mongoose = require("mongoose");

const backendSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  name: String,
  url: String,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("BackendService", backendSchema);
