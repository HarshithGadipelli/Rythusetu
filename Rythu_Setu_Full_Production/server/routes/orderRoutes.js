const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");
const { buildUpiQr } = require("../services/paymentQR");

router.post("/checkout", requireAuth, requireRole("customer"), async (req, res) => {
  try {
    const { items = [], deliveryAddress = "", paymentMode = "Cash", customerLocation = { lat: null, lng: null } } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const created = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).populate("farmer", "name");
      if (!product) continue;

      const qty = Math.max(1, Number(item.quantity || 1));
      if (product.quantity < qty) return res.status(400).json({ message: `Not enough stock for ${product.name}` });

      product.quantity -= qty;
      await product.save();

      const totalPrice = product.price * qty;
      grandTotal += totalPrice;

      const paymentQr = paymentMode === "UPI" ? await buildUpiQr(totalPrice, `Rythu Setu - ${product.name}`) : "";

      const order = await Order.create({
        product: product._id,
        farmer: product.farmer?._id || product.farmer,
        customer: req.user.id,
        quantity: qty,
        totalPrice,
        paymentMode,
        paymentStatus: paymentMode === "Cash" ? "pending" : "paid",
        status: "confirmed",
        deliveryAddress,
        customerLocation,
        paymentQr
      });

      created.push(order);
    }

    const populated = await Order.find({ _id: { $in: created.map((o) => o._id) } })
      .populate("product")
      .populate("farmer", "name phone")
      .populate("customer", "name email");

    res.status(201).json({
      message: "Order placed",
      totalAmount: grandTotal,
      orders: populated,
      paymentQr: paymentMode === "UPI" && populated.length ? populated[0].paymentQr : ""
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const query = req.user.role === "customer"
      ? { customer: req.user.id }
      : req.user.role === "farmer"
        ? { farmer: req.user.id }
        : {};

    const orders = await Order.find(query)
      .populate("product")
      .populate("farmer", "name phone")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const orders = await Order.find()
    .populate("product")
    .populate("farmer", "name phone")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { status, driverLocation } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (driverLocation) order.driverLocation = driverLocation;
    await order.save();

    const io = req.app.get("io");
    if (io) io.emit("orderStatusUpdated", { orderId: order._id, status: order.status, driverLocation: order.driverLocation });

    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/feedback", requireAuth, requireRole("customer"), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id).populate("farmer");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.customer) !== String(req.user.id)) return res.status(403).json({ message: "Forbidden" });

    order.feedback = { rating: Number(rating || 5), comment: comment || "" };
    await order.save();

    const farmerUser = await User.findById(order.farmer?._id || order.farmer);
    if (farmerUser) {
      farmerUser.stats.positiveFeedback += Number(rating || 5) >= 4 ? 1 : 0;
      farmerUser.stats.negativeFeedback += Number(rating || 5) <= 2 ? 1 : 0;
      farmerUser.stats.rating = Math.max(1, Math.min(5, Number(rating || 5)));
      await farmerUser.save();
    }

    res.json({ message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
