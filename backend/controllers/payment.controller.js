require('dotenv').config(); 

const stripe = require('stripe');


const rawKey = process.env.STRIPE_SECRET_KEY || '';
const cleanKey = rawKey.replace(/[\s"]/g, '');


if (!cleanKey || cleanKey.length < 50) {
    console.error("FATAL HATA: Stripe Secret Key bulunamadi veya cok kisa! (.env dosyasini kontrol edin)");
}


const stripeInstance = stripe(cleanKey); 

// cleaned secret key from sendgrid api clash
console.log("Stripe Secret Key'in son 4 hanesi:", cleanKey.slice(-4));
console.log("Bulunan Uzunluk (Temizlenmiş):", cleanKey.length); 


const createPaymentIntent = async (req, res) => {
    
    const { amount, currency = 'usd' } = req.body; 

    // İsteğin alındığını kontrol et
    console.log(`[Stripe] Payment Intent requested Tutar: ${amount} ${currency}`); 

    if (!amount || amount <= 0) {
        // Log 1.1: amount 0 veya yok
        console.error(`[Stripe] errorinvalide amount , amount: ${amount}`);
        return res.status(400).json({ error: "Minimum amount required." });
    }
    
    // payment methods use 1to*100 ratio for every prducts price
    const amountInCents = Math.round(amount * 100); 

    try {
        
        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount: amountInCents,
            currency: currency, 
            
            automatic_payment_methods: {
                enabled: true, 
            },
        });

        
        console.log(`[Stripe] Payment Intent created Client Secret started: ${paymentIntent.client_secret.slice(0, 10)}...`); 


        
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        
        console.error("Stripe Payment Intent generate error:");
        console.error("   erroe:", error.message);
        console.error("   typoe:", error.type);
       res.status(500).json({ 
            error: error.message || "An unknown error occurred while processing the payment intent." 
        });
    }
};

module.exports = {
    createPaymentIntent,
};