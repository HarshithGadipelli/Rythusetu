const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  organic: { type: Boolean, default: false },
  pesticideFree: { type: Boolean, default: false },
  category: { type: String, default: "vegetables" },
  photoPath: { type: String, default: "" },
  saleLive: { type: Boolean, default: true },
  trustScore: { type: Number, default: 50 },
  location: {
    address: { type: String, default: "" },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
