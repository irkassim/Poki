const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.createCheckoutSession = async (req, res) => {
    const { priceId } = req.body; // Use Stripe Price IDs for subscriptions
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
  
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error.message);
      res.status(500).json({ error: 'Could not create checkout session' });
    }
  };
  