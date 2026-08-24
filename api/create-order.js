const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Keys not set in Vercel env' });
    }
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { cart } = req.body;
    let totalInr = 0;
    cart.forEach(item => { totalInr += (item.price * 83) * item.qty; });

    const order = await razorpay.orders.create({
      amount: totalInr * 100,
      currency: 'INR',
      receipt: 'bloom_' + Date.now(),
    });

    res.json({ orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
