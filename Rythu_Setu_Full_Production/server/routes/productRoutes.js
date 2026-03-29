const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const User = require("../models/User");
const { requireAuth, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { calculateTrustScore } = require("../services/trustScore");

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad((lat2 || 0) - (lat1 || 0));
  const dLng = toRad((lng2 || 0) - (lng1 || 0));
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1 || 0)) * Math.cos(toRad(lat2 || 0)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get("/", async (req, res) => {
  try {
    const { q = "", organic, pesticideFree, category, sort = "newest", lat, lng, maxDistance } = req.query;

    const filter = { saleLive: true };
    if (organic === "true") filter.organic = true;
    if (pesticideFree === "true") filter.pesticideFree = true;
    if (category) filter.category = category;

    const items = await Product.find(filter).populate("farmer", "name email phone location verified stats");
    let products = items.map((p) => {
      const farmerTrustScore = calculateTrustScore(p.farmer || {});
      const distanceKm = lat && lng && p.location?.lat != null && p.location?.lng != null
        ? Number(haversine(Number(lat), Number(lng), p.location.lat, p.location.lng).toFixed(2))
        : null;

      return {
        ...p.toObject(),
        farmerName: p.farmer?.name || "Farmer",
        farmerTrustScore,
        distanceKm
      };
    });

    if (q) {
      const s = q.toLowerCase();
      products = products.filter((p) => [p.name, p.description, p.category, p.farmerName].join(" ").toLowerCase().includes(s));
    }

    if (maxDistance && lat && lng) products = products.filter((p) => p.distanceKm == null || p.distanceKm <= Number(maxDistance));

    if (sort === "price_asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") products.sort((a, b) => b.price - a.price);
    if (sort === "trust_desc") products.sort((a, b) => b.farmerTrustScore - a.farmerTrustScore);
    if (sort === "distance_asc") products.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    if (sort === "newest") products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/mine", requireAuth, requireRole("farmer"), async (req, res) => {
  const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(products);
});

router.get("/insights", requireAuth, requireRole("farmer", "admin"), async (req, res) => {
  const products = await Product.find().lean();
  const farmers = await User.find({ role: "farmer" }).lean();
  const orderCounts = products.map((p) => ({
    productId: p._id,
    name: p.name,
    demandScore: p.trustScore || 50
  }));
  res.json({
    recommendedProducts: orderCounts.sort((a, b) => b.demandScore - a.demandScore).slice(0, 5),
    farmers: farmers.length,
    message: "AI demand insights ready"
  });
});

router.post("/", requireAuth, requireRole("farmer"), upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, quantity, organic, pesticideFree, category, address, lat, lng, saleLive } = req.body;
    if (!name || !price || !quantity) return res.status(400).json({ message: "Name, price and quantity are required" });

    const farmer = await User.findById(req.user.id);
    const trustScore = calculateTrustScore(farmer || {});

    const product = await Product.create({
      name,
      description: description || "",
      price: Number(price),
      quantity: Number(quantity),
      organic: organic === "true" || organic === true,
      pesticideFree: pesticideFree === "true" || pesticideFree === true,
      category: category || "vegetables",
      photoPath: req.file ? `/uploads/${req.file.filename}` : "",
      saleLive: saleLive === "true" || saleLive === true,
      trustScore,
      farmer: req.user.id,
      location: { address: address || "", lat: lat ? Number(lat) : null, lng: lng ? Number(lng) : null }
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmer", "name email phone location verified stats");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      ...product.toObject(),
      farmerName: product.farmer?.name || "Farmer",
      farmerTrustScore: calculateTrustScore(product.farmer || {})
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
