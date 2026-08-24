require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart empty' });
    let totalInr = 0;
    cart.forEach(item => { totalInr += (item.price * 83) * item.qty; });
    const options = { amount: totalInr * 100, currency: 'INR', receipt: 'bloom_' + Date.now() };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
