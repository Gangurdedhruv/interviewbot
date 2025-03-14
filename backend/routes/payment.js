import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

async function handlePayment(req, res) {
  try {
    const { amount, currency, description } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method_types: ["card"],
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
}

router.post("/create-payment-intent", handlePayment);

export default router;