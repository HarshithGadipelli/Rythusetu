function calculateTrustScore(user) {
  const stats = user.stats || {};
  let score = 40;

  if (user.verified) score += 20;
  score += Math.min(20, (stats.sales || 0) * 2);
  score += Math.min(10, (stats.deliveries || 0) * 2);
  score += Math.min(10, (stats.rating || 5) * 2);

  const feedbackBonus = (stats.positiveFeedback || 0) - (stats.negativeFeedback || 0);
  score += Math.max(-10, Math.min(10, feedbackBonus * 2));

  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { calculateTrustScore };
