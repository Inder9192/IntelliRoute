const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  name: String,
  apiKey: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tenant", tenantSchema);
