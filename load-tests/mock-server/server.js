const express = require('express');
const app = express();
const PORT = 4000;

// Simulate a realistic product catalog payload
const products = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `Rs. ${(Math.random() * 2000 + 100).toFixed(0)}`,
  brand: ['Polo', 'H&M', 'Denim', 'Biba'][i % 4],
  category: { usertype: { usertype: 'Women' }, category: 'Dress' },
}));

// Simulate a heavier endpoint with artificial delay + payload size,
// similar to a real product-search/catalog endpoint under load
app.get('/api/productsList', (req, res) => {
  setTimeout(() => {
    res.json({ responseCode: 200, products });
  }, 100 + Math.random() * 150); // 100-250ms simulated processing time
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});