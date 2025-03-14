const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Fixed from process.meta.env

app.use(cors());
app.use(express.json());

// Keep your original endpoint but make it also respond to the new path
app.post("/api/payment", handlePayment);
app.post("/api/create-payment-intent", handlePayment);

// Separate the handler function to avoid duplicate code
async function handlePayment(req, res) {
  try {
    const { amount, currency, description } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}

app.listen(5173, () => console.log("Server running on port 5173"));