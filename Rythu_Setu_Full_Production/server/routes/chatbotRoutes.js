const express = require("express");
const router = express.Router();
router.post("/message", (req, res) => {
  const message = String(req.body.message || "").toLowerCase();

  let reply = "Ask me about crops, prices, delivery, or demand trends.";
  if (message.includes("pest")) reply = "Use neem oil spray and isolate affected plants.";
  if (message.includes("fertilizer")) reply = "Organic compost and vermicompost are recommended.";
  if (message.includes("price")) reply = "Check demand insights on the farmer dashboard before pricing.";
  if (message.includes("plant")) reply = "Plant seasonal crops based on weather and local demand.";

  res.json({ reply });
});

module.exports = router;
