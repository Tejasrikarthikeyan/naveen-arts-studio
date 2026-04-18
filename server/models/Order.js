const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String, // optional if guest checkout is allowed
  orderType: { type: String, enum: ['commission', 'shop'], default: 'commission' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  address: String,
  
  // Commission specific
  paperSize: { type: String },
  portraitType: { type: String },
  description: String,
  referenceImages: [String],
  
  // Shop specific
  items: Array,
  
  status: { type: String, default: "pending" },
  total: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);