const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

async function seedDemoData() {
  const usersCount = await User.countDocuments();
  if (usersCount > 0) return;

  const adminPwd = await bcrypt.hash("Admin@123", 10);
  const farmerPwd = await bcrypt.hash("Farmer@123", 10);
  const customerPwd = await bcrypt.hash("Customer@123", 10);

  const farmer = await User.create({
    name: "Demo Farmer",
    email: "farmer@rythusetu.com",
    password: farmerPwd,
    role: "farmer",
    verified: true,
    phone: "9000000001",
    location: { address: "Village Road, Andhra Pradesh", lat: 17.385, lng: 78.486 }
  });

  const customer = await User.create({
    name: "Demo Customer",
    email: "customer@rythusetu.com",
    password: customerPwd,
    role: "customer",
    verified: true,
    phone: "9000000002"
  });

  await User.create({
    name: "Admin",
    email: "admin@rythusetu.com",
    password: adminPwd,
    role: "admin",
    verified: true,
    phone: "9000000000"
  });

  const products = await Product.insertMany([
    {
      name: "Organic Tomato",
      description: "Fresh village-grown tomatoes",
      price: 40,
      quantity: 120,
      organic: true,
      pesticideFree: true,
      category: "vegetables",
      photoPath: "",
      saleLive: true,
      trustScore: 88,
      farmer: farmer._id,
      location: { address: "Village Road", lat: 17.39, lng: 78.48 }
    },
    {
      name: "Organic Mango",
      description: "Sweet seasonal mangoes",
      price: 120,
      quantity: 60,
      organic: true,
      pesticideFree: true,
      category: "fruits",
      photoPath: "",
      saleLive: true,
      trustScore: 92,
      farmer: farmer._id,
      location: { address: "Village Road", lat: 17.41, lng: 78.5 }
    }
  ]);

  await Order.create({
    product: products[0]._id,
    farmer: farmer._id,
    customer: customer._id,
    quantity: 2,
    totalPrice: 80,
    paymentMode: "Cash",
    paymentStatus: "pending",
    status: "delivered",
    deliveryAddress: "Customer Home",
    customerLocation: { lat: 17.42, lng: 78.46 }
  });

  console.log("Demo seed completed");
}

module.exports = { seedDemoData };
