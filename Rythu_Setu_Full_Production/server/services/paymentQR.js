const QRCode = require("qrcode");

async function buildUpiQr(amount, note = "Rythu Setu Order") {
  const upiId = process.env.UPI_ID || "farmer@upi";
  const uri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Rythu Setu")}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  return QRCode.toDataURL(uri);
}

module.exports = { buildUpiQr };
