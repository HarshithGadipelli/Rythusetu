const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentMode: { type: String, enum: ["UPI", "Debit Card", "Credit Card", "Cash"], default: "Cash" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  status: { type: String, enum: ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"], default: "pending" },
  deliveryAddress: { type: String, default: "" },
  customerLocation: { lat: { type: Number, default: null }, lng: { type: Number, default: null } },
  driverLocation: { lat: { type: Number, default: null }, lng: { type: Number, default: null } },
  paymentQr: { type: String, default: "" },
  feedback: { rating: { type: Number, default: null }, comment: { type: String, default: "" } }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
