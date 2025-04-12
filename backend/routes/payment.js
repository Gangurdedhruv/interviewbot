import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Transaction from '../models/transactions.js';
import Users from '../models/Users.js'

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

async function saveTransac(req, res) {
  try{
    // console.log(req.body)
    const res1 = await Transaction.create(req.body)
    const res2 = await Users.findByIdAndUpdate({_id: req.body.userId}, { paymentStatus: true}, {new:true})
    // console.log(res2)
    return res.json({
        success: true,
        message: res1
    });
  } catch (err) {
      // console.log(err)
      return res.status(500).json({
          success: false,
          error: err
      })
  }
}

router.post("/create-payment-intent", handlePayment);
router.post("/save-transac", saveTransac)

export default router;