const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const notifyUser = require("../utils/notifyUser");
const auth = require("../middleware/auth"); // Import the auth middleware

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create a payment session for a course
router.post("/create-checkout-session", auth, async (req, res) => {
  const { courseName, price } = req.body;

  try {
    // Validate input
    if (!courseName || !price) {
      return res.status(400).json({ message: "Course name and price are required" });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseName,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
    });

    // Notify the user about the successful payment
    await notifyUser(req.user.id, `💳 Payment successful! You've purchased the course "${courseName}". Start learning now!`);

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
