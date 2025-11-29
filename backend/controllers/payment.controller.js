require('dotenv').config(); 

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 


exports.createPaymentIntent = async (req, res) => {
    
    const { amount } = req.body; 
    const userId = req.userId;

    if (!amount || amount <= 0) {
        return res.status(400).send({ message: "Invalid amount." });
    }

   
    const amountInCents = Math.round(amount * 100); 

    try {
       
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd', 
            automatic_payment_methods: { enabled: true },
            metadata: { userId: userId }, 
        });

   
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Stripe Hata:", error.message);
        res.status(500).send({ 
            message: "Failed to create Payment Intent due to Stripe error.", 
            error: error.message 
        });
    }
};


exports.handleWebhook = (req, res) => {
    
    res.status(200).send({ received: true });
};
