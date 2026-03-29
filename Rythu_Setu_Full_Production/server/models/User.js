const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  location: {
    address: { type: String, default: "" },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  role: {
    type: String,
    enum: ["farmer", "customer", "admin"],
    default: "customer"
  },
  verified: { type: Boolean, default: false },
  stats: {
    sales: { type: Number, default: 0 },
    deliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    positiveFeedback: { type: Number, default: 0 },
    negativeFeedback: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
