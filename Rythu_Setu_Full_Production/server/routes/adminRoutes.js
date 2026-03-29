const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { requireAuth, requireRole } = require("../middleware/auth");
const { buildDemandInsights } = require("../services/demandML");
const { optimizeRoute } = require("../services/routeOptimizer");

router.get("/analytics", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const farmers = await User.countDocuments({ role: "farmer" });
    const customers = await User.countDocuments({ role: "customer" });
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }]);
    const revenue = revenueAgg[0]?.totalRevenue || 0;

    const productList = await Product.find().lean();
    const orderList = await Order.find().lean();
    const demand = buildDemandInsights(productList, orderList);

    res.json({ farmers, customers, products, orders, revenue, demand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/insights", requireAuth, requireRole("farmer", "admin"), async (req, res) => {
  const products = await Product.find().lean();
  const orders = await Order.find().lean();
  res.json(buildDemandInsights(products, orders));
});

router.get("/farmers/pending", requireAuth, requireRole("admin"), async (req, res) => {
  const farmers = await User.find({ role: "farmer", verified: false }).sort({ createdAt: -1 });
  res.json(farmers);
});

router.post("/farmers/:id/verify", requireAuth, requireRole("admin"), async (req, res) => {
  const farmer = await User.findById(req.params.id);
  if (!farmer) return res.status(404).json({ message: "Farmer not found" });
  farmer.verified = true;
  await farmer.save();
  res.json({ message: "Farmer verified", farmer });
});

router.get("/orders", requireAuth, requireRole("admin"), async (req, res) => {
  const orders = await Order.find()
    .populate("product")
    .populate("farmer", "name phone")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.post("/route-optimize", requireAuth, requireRole("admin"), async (req, res) => {
  const { stops = [], origin = { lat: 0, lng: 0 } } = req.body;
  const optimized = optimizeRoute(stops, origin);
  res.json({ route: optimized });
});

module.exports = router;
