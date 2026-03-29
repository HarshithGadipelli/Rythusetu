function buildDemandInsights(products = [], orders = []) {
  const orderMap = new Map();
  for (const order of orders) {
    const key = String(order.product?._id || order.product);
    orderMap.set(key, (orderMap.get(key) || 0) + Number(order.quantity || 1));
  }

  const scored = products.map((product) => {
    const id = String(product._id);
    const orderCount = orderMap.get(id) || 0;
    const stock = Number(product.quantity || 0);
    const trust = Number(product.trustScore || 50);
    const organicBoost = product.organic ? 5 : 0;
    const score = Math.round(orderCount * 8 + trust + organicBoost + Math.max(0, 20 - stock / 10));
    return {
      productId: product._id,
      name: product.name,
      category: product.category,
      orderCount,
      stock,
      trustScore: trust,
      demandScore: score
    };
  });

  scored.sort((a, b) => b.demandScore - a.demandScore);

  return {
    topProducts: scored.slice(0, 5),
    seasonalSuggestions: ["Leafy vegetables", "Tomato", "Onion", "Chilli", "Coriander", "Mango"],
    message: scored.length ? `High demand: ${scored[0].name}` : "No demand data yet"
  };
}

module.exports = { buildDemandInsights };
